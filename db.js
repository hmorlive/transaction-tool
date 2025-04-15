import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open SQLite connection
const dbPromise = open({
  filename: path.join(__dirname, 'transactions.db'),
  driver: sqlite3.Database,
});

const initDb = async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      description TEXT,
      amount REAL,
      category TEXT,
      excluded INTEGER DEFAULT 0
    );
  `);
  return db;
};

export default initDb;