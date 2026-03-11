import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
app.disable('x-powered-by');

const PORT = Number(process.env.PORT || 4000);
const AUTH_TTL_MS = Number(process.env.SESSION_TTL_HOURS || 24) * 60 * 60 * 1000;
const ADMIN_PASSWORD_FALLBACK = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'change_me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const LOGIN_RATE_LIMIT_WINDOW_MS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_RATE_LIMIT_MAX = Number(process.env.LOGIN_RATE_LIMIT_MAX || 10);

const sessions = new Map();
const loginAttempts = new Map();

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, originalHash] = stored.split(':');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  const left = Buffer.from(hash, 'hex');
  const right = Buffer.from(originalHash, 'hex');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function getAuthToken(req) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

function requireAdmin(req, res, next) {
  const token = getAuthToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const session = sessions.get(token);
  if (!session || Date.now() > session.expiry) {
    if (session) sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  next();
}

function setSecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  if ((req.headers['x-forwarded-proto'] || '').toString().includes('https')) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

function loginRateLimit(req, res, next) {
  const now = Date.now();
  const ip = getClientIp(req);
  const existing = loginAttempts.get(ip);

  if (!existing || now > existing.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (existing.count >= LOGIN_RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(Math.max(retryAfterSeconds, 1)));
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  existing.count += 1;
  return next();
}

function clearLoginAttempts(req) {
  const ip = getClientIp(req);
  loginAttempts.delete(ip);
}

function auditLog(event, details = {}) {
  const payload = {
    ts: new Date().toISOString(),
    event,
    ...details,
  };
  console.log('[AUDIT]', JSON.stringify(payload));
}

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const seed = {
      meta: { adminPasswordHash: hashPassword(ADMIN_PASSWORD_FALLBACK) },
      categories: [],
      menuItems: [],
    };
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const parsed = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));

  if (!parsed.meta?.adminPasswordHash) {
    parsed.meta = { ...(parsed.meta || {}), adminPasswordHash: hashPassword(ADMIN_PASSWORD_FALLBACK) };
    await fs.writeFile(DB_PATH, JSON.stringify(parsed, null, 2));
  }

  if (!Array.isArray(parsed.categories)) parsed.categories = [];
  if (!Array.isArray(parsed.menuItems)) parsed.menuItems = [];

  return parsed;
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

app.use(setSecurityHeaders);
app.use(
  cors({
    origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_, res) =>
  res.json({
    ok: true,
    uptimeSec: Math.round(process.uptime()),
    now: new Date().toISOString(),
  }),
);

app.get(
  '/api/menu',
  asyncRoute(async (_, res) => {
    const db = await readDb();
    res.json({ categories: db.categories, menuItems: db.menuItems });
  }),
);

app.post(
  '/api/admin/login',
  loginRateLimit,
  asyncRoute(async (req, res) => {
    const { password } = req.body ?? {};
    if (typeof password !== 'string' || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const db = await readDb();
    if (!verifyPassword(password, db.meta.adminPasswordHash)) {
      auditLog('admin_login_failed', { ip: getClientIp(req) });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    clearLoginAttempts(req);
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + AUTH_TTL_MS;
    sessions.set(token, { expiry });

    auditLog('admin_login_success', { ip: getClientIp(req), expiresAt: new Date(expiry).toISOString() });
    res.json({ token, expiry });
  }),
);

app.post(
  '/api/admin/change-password',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const { currentPassword, newPassword } = req.body ?? {};
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const normalizedNew = newPassword.trim();
    if (normalizedNew.length < 8) {
      return res.status(400).json({ error: 'Yeni şifre en az 8 karakter olmalı.' });
    }

    const db = await readDb();
    if (!verifyPassword(currentPassword, db.meta.adminPasswordHash)) {
      auditLog('admin_change_password_failed', { reason: 'wrong_current_password' });
      return res.status(401).json({ error: 'Mevcut şifre yanlış.' });
    }

    db.meta.adminPasswordHash = hashPassword(normalizedNew);
    await writeDb(db);

    auditLog('admin_change_password_success');
    res.json({ ok: true });
  }),
);

app.post(
  '/api/bootstrap',
  asyncRoute(async (req, res) => {
    const { categories = [], menuItems = [] } = req.body ?? {};
    if (!Array.isArray(categories) || !Array.isArray(menuItems)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const db = await readDb();
    if (db.categories.length || db.menuItems.length) {
      return res.status(409).json({ error: 'Database already initialized' });
    }
    db.categories = categories.map((c) => ({ ...c, id: c.id || createId() }));
    db.menuItems = menuItems.map((i) => ({ ...i, id: i.id || createId() }));
    await writeDb(db);
    auditLog('bootstrap_completed', {
      categories: db.categories.length,
      menuItems: db.menuItems.length,
    });
    res.status(201).json({ categories: db.categories, menuItems: db.menuItems });
  }),
);

app.put(
  '/api/categories',
  requireAdmin,
  asyncRoute(async (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Categories must be array' });
    const db = await readDb();
    db.categories = req.body;
    await writeDb(db);
    auditLog('categories_updated', { count: db.categories.length });
    res.json(db.categories);
  }),
);

app.put(
  '/api/menu-items',
  requireAdmin,
  asyncRoute(async (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Menu items must be array' });
    const db = await readDb();
    db.menuItems = req.body;
    await writeDb(db);
    auditLog('menu_items_updated', { count: db.menuItems.length });
    res.json(db.menuItems);
  }),
);

app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiry) sessions.delete(token);
  }
  for (const [ip, state] of loginAttempts.entries()) {
    if (now > state.resetAt) loginAttempts.delete(ip);
  }
}, 60 * 1000).unref();

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
