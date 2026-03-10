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
const PORT = Number(process.env.PORT || 4000);

const AUTH_TTL_MS = 24 * 60 * 60 * 1000;
const ADMIN_PASSWORD_FALLBACK = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || 'change_me';
const sessions = new Map();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

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

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/menu', async (_, res) => {
  const db = await readDb();
  res.json({ categories: db.categories, menuItems: db.menuItems });
});

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body ?? {};
  if (typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const db = await readDb();
  if (!verifyPassword(password, db.meta.adminPasswordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + AUTH_TTL_MS;
  sessions.set(token, { expiry });

  res.json({ token, expiry });
});

app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const normalizedNew = newPassword.trim();
  if (normalizedNew.length < 6) {
    return res.status(400).json({ error: 'Yeni şifre en az 6 karakter olmalı.' });
  }

  const db = await readDb();
  if (!verifyPassword(currentPassword, db.meta.adminPasswordHash)) {
    return res.status(401).json({ error: 'Mevcut şifre yanlış.' });
  }

  db.meta.adminPasswordHash = hashPassword(normalizedNew);
  await writeDb(db);

  res.json({ ok: true });
});

app.post('/api/bootstrap', async (req, res) => {
  const { categories = [], menuItems = [] } = req.body ?? {};
  if (!Array.isArray(categories) || !Array.isArray(menuItems)) return res.status(400).json({ error: 'Invalid payload' });
  const db = await readDb();
  if (db.categories.length || db.menuItems.length) return res.status(409).json({ error: 'Database already initialized' });
  db.categories = categories.map((c) => ({ ...c, id: c.id || createId() }));
  db.menuItems = menuItems.map((i) => ({ ...i, id: i.id || createId() }));
  await writeDb(db);
  res.status(201).json({ categories: db.categories, menuItems: db.menuItems });
});

app.put('/api/categories', requireAdmin, async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Categories must be array' });
  const db = await readDb();
  db.categories = req.body;
  await writeDb(db);
  res.json(db.categories);
});

app.put('/api/menu-items', requireAdmin, async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Menu items must be array' });
  const db = await readDb();
  db.menuItems = req.body;
  await writeDb(db);
  res.json(db.menuItems);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
