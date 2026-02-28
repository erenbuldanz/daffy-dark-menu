import express from 'express';
import cors from 'cors';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');
const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

async function ensureDb() {
  try { await fs.access(DB_PATH); } catch { await fs.writeFile(DB_PATH, JSON.stringify({ categories: [], menuItems: [] }, null, 2)); }
}
async function readDb() { await ensureDb(); return JSON.parse(await fs.readFile(DB_PATH, 'utf-8')); }
async function writeDb(data) { await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2)); }

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/menu', async (_, res) => res.json(await readDb()));
app.post('/api/bootstrap', async (req, res) => {
  const { categories = [], menuItems = [] } = req.body ?? {};
  if (!Array.isArray(categories) || !Array.isArray(menuItems)) return res.status(400).json({ error: 'Invalid payload' });
  const db = await readDb();
  if (db.categories.length || db.menuItems.length) return res.status(409).json({ error: 'Database already initialized' });
  const seeded = { categories: categories.map((c) => ({ ...c, id: c.id || createId() })), menuItems: menuItems.map((i) => ({ ...i, id: i.id || createId() })) };
  await writeDb(seeded);
  res.status(201).json(seeded);
});
app.put('/api/categories', async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Categories must be array' });
  const db = await readDb(); db.categories = req.body; await writeDb(db); res.json(db.categories);
});
app.put('/api/menu-items', async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Menu items must be array' });
  const db = await readDb(); db.menuItems = req.body; await writeDb(db); res.json(db.menuItems);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
