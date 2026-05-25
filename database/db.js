const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "lendoo.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_book_id TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    thumbnail TEXT,
    description TEXT,
    pages INTEGER,
    published_date TEXT,
    category TEXT,
    status TEXT DEFAULT 'quero'
  )
`);

module.exports = db;
