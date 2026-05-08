import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'urls.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function createShortUrl(originalUrl: string): string {
  const code = generateCode();
  const stmt = db.prepare('INSERT INTO urls (code, original_url) VALUES (?, ?)');
  stmt.run(code, originalUrl);
  return code;
}

export function getUrlByCode(code: string): { original_url: string; clicks: number } | null {
  const stmt = db.prepare('SELECT original_url, clicks FROM urls WHERE code = ?');
  return stmt.get(code) as { original_url: string; clicks: number } | null;
}

export function incrementClicks(code: string): void {
  const stmt = db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE code = ?');
  stmt.run(code);
}

export function getAllUrls(): Array<{
  id: number;
  code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}> {
  const stmt = db.prepare('SELECT * FROM urls ORDER BY created_at DESC');
  return stmt.all() as Array<{
    id: number;
    code: string;
    original_url: string;
    clicks: number;
    created_at: string;
  }>;
}

function generateCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default db;
