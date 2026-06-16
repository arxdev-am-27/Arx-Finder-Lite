const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.get("/api/documents", (req, res) => {
  const search = req.query.search || "";

  db.all(
    `
    SELECT * FROM documents
    WHERE name LIKE ?
    OR category LIKE ?
    OR description LIKE ?
    ORDER BY created_at DESC
  `,
    [`%${search}%`, `%${search}%`, `%${search}%`],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
});

app.post("/api/documents", (req, res) => {
  const { name, category, description } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Document name required",
    });
  }

  db.run(
    `
    INSERT INTO documents
    (name, category, description)
    VALUES (?, ?, ?)
  `,
    [name, category, description],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Arx Index Lite running on port ${PORT}`);
});