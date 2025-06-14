import express from "express";
import db from "../db.js";
import { generateId, generateSecret } from "../utils.js";

const router = express.Router();

// Create Account
router.post("/", (req, res) => {
  const { email, name, website } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }
  const id = generateId();
  const secret = generateSecret();

  const stmt = db.prepare(
    "INSERT INTO accounts (id, email, name, website, secret) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(id, email, name, website || null, secret, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "DB Error" });
    }
    res.status(201).json({ id, email, name, website, secret });
  });
});

// Read all accounts
router.get("/", (req, res) => {
  db.all("SELECT id, email, name, website FROM accounts", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json(rows);
  });
});

// Read one account by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    "SELECT id, email, name, website FROM accounts WHERE id = ?",
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      if (!row) return res.status(404).json({ error: "Account not found" });
      res.json(row);
    }
  );
});

// Update account by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { email, name, website } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Email and name are required" });
  }

  const stmt = db.prepare(
    "UPDATE accounts SET email = ?, name = ?, website = ? WHERE id = ?"
  );
  stmt.run(email, name, website || null, id, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "DB Error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ message: "Account updated" });
  });
});

// Delete account by ID (should cascade delete destinations)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM accounts WHERE id = ?");
  stmt.run(id, function (err) {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Account not found" });
    res.json({ message: "Account deleted" });
  });
});

export default router;
