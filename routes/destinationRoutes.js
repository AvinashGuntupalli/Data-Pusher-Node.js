import express from "express";
import db from "../db.js";
import { generateId } from "../utils.js";

const router = express.Router();

// Create Destination for an Account
router.post("/:accountId/destinations", (req, res) => {
  const { accountId } = req.params;
  const { url, method, headers } = req.body;

  if (!url || !method || !headers) {
    return res
      .status(400)
      .json({ error: "url, method, and headers are required" });
  }

  // Validate headers is an object
  if (typeof headers !== "object") {
    return res.status(400).json({ error: "headers must be an object" });
  }

  const id = generateId();

  const stmt = db.prepare(
    "INSERT INTO destinations (id, accountId, url, method, headers) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(
    id,
    accountId,
    url,
    method.toUpperCase(),
    JSON.stringify(headers),
    function (err) {
      if (err) {
        return res.status(500).json({ error: "DB Error" });
      }
      res
        .status(201)
        .json({ id, accountId, url, method: method.toUpperCase(), headers });
    }
  );
});

// Get all destinations for an account
router.get("/:accountId/destinations", (req, res) => {
  const { accountId } = req.params;

  db.all(
    "SELECT id, url, method, headers FROM destinations WHERE accountId = ?",
    [accountId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "DB Error" });
      res.json(
        rows.map((row) => ({
          ...row,
          headers: JSON.parse(row.headers),
        }))
      );
    }
  );
});

// Get a single destination by id
router.get("/destinations/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM destinations WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (!row) return res.status(404).json({ error: "Destination not found" });
    res.json({ ...row, headers: JSON.parse(row.headers) });
  });
});

// Update destination by id
router.put("/destinations/:id", (req, res) => {
  const { id } = req.params;
  const { url, method, headers } = req.body;

  if (!url || !method || !headers) {
    return res
      .status(400)
      .json({ error: "url, method, and headers are required" });
  }

  if (typeof headers !== "object") {
    return res.status(400).json({ error: "headers must be an object" });
  }

  const stmt = db.prepare(
    "UPDATE destinations SET url = ?, method = ?, headers = ? WHERE id = ?"
  );
  stmt.run(
    url,
    method.toUpperCase(),
    JSON.stringify(headers),
    id,
    function (err) {
      if (err) return res.status(500).json({ error: "DB Error" });
      if (this.changes === 0)
        return res.status(404).json({ error: "Destination not found" });
      res.json({ message: "Destination updated" });
    }
  );
});

// Delete destination by id
router.delete("/destinations/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM destinations WHERE id = ?");
  stmt.run(id, function (err) {
    if (err) return res.status(500).json({ error: "DB Error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Destination not found" });
    res.json({ message: "Destination deleted" });
  });
});

export default router;
