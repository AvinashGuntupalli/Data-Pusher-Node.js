import sqlite3Pkg from "sqlite3";

const sqlite3 = sqlite3Pkg.verbose();
const DBSOURCE = "data-pusher.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
    throw err;
  }
  console.log("Connected to SQLite database.");

  db.run(`CREATE TABLE IF NOT EXISTS accounts (
    account_id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    account_name TEXT NOT NULL,
    app_secret_token TEXT NOT NULL,
    website TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    destination_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    url TEXT NOT NULL,
    http_method TEXT NOT NULL,
    headers TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
  )`);
});

export default db;
