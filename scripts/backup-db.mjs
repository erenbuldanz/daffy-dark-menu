import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dbPath = path.join(root, 'server', 'db.json');
const backupsDir = path.join(root, 'backups');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outPath = path.join(backupsDir, `db-backup-${stamp}.json`);

await fs.mkdir(backupsDir, { recursive: true });
await fs.copyFile(dbPath, outPath);

console.log(`Backup created: ${outPath}`);
