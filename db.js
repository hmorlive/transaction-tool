import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Open database
const dbPromise = open({
  filename: path.join(__dirname, "transactions.db"),
  driver: sqlite3.Database,
});

const initDb = async () => {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      subcategory TEXT,
      excluded INTEGER DEFAULT 0,
      notes TEXT,
      type TEXT CHECK(type IN ('expense', 'income')) DEFAULT 'expense'
    );
  `);

  return db;
};

export default initDb;