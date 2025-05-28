import express from "express";
import db from "../db.js";
import fetch from "node-fetch";

const router = express.Router();

router.post("/server/incoming_data", async (req, res) => {
  // Check content-type is application/json
  if (!req.is("application/json")) {
    return res.status(400).json({ error: "Invalid Data" });
  }

  const secretToken =
    req.headers["x-app-secret"] || req.body.secret || req.query.secret;

  if (!secretToken) {
    return res.status(401).json({ error: "Un Authenticate" });
  }

  // Find account by secret
  db.get(
    "SELECT * FROM accounts WHERE secret = ?",
    [secretToken],
    async (err, account) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!account) {
        return res.status(401).json({ error: "Un Authenticate" });
      }

      // Get destinations for this account
      db.all(
        "SELECT * FROM destinations WHERE accountId = ?",
        [account.id],
        async (err, destinations) => {
          if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (!destinations || destinations.length === 0) {
            return res.status(200).json({
              message: "No destinations configured for this account",
            });
          }

          // Forward data to all destinations concurrently
          const forwardPromises = destinations.map((dest) => {
            const headers = JSON.parse(dest.headers);

            return fetch(dest.url, {
              method: dest.method.toUpperCase(),
              headers: {
                "Content-Type": "application/json",
                ...headers,
              },
              body: JSON.stringify(req.body),
            })
              .then((response) => ({
                destinationId: dest.id,
                status: response.status,
              }))
              .catch((fetchErr) => ({
                destinationId: dest.id,
                error: fetchErr.message,
              }));
          });

          const results = await Promise.all(forwardPromises);

          res.status(200).json({
            message: "Data forwarded to destinations",
            results,
          });
        }
      );
    }
  );
});

export default router;
