import express from "express";
import cors from "cors";
import multer from "multer";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- Middleware ----
app.use(cors({
  origin: "http://localhost:3000", // only allow frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ---- File Upload Setup ----
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ---- Database Setup ----
let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, "database.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      filepath TEXT,
      filesize INTEGER,
      createdAt TEXT
    )
  `);
})();

// ---- Routes ----

// Upload recording
app.post("/api/recordings", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename, size, path: relPath } = req.file;
  const absolutePath = path.resolve(relPath);
  const createdAt = new Date().toISOString();

  await db.run(
    "INSERT INTO recordings (filename, filepath, filesize, createdAt) VALUES (?, ?, ?, ?)",
    [filename, absolutePath, size, createdAt]
  );

  res.status(201).json({
    message: "Recording uploaded successfully",
    recording: { filename, size, createdAt },
  });
});

// Get all recordings
app.get("/api/recordings", async (req, res) => {
  const rows = await db.all("SELECT * FROM recordings ORDER BY createdAt DESC");
  res.json(rows);
});

// Stream a recording
app.get("/api/recordings/:id", async (req, res) => {
  const row = await db.get("SELECT * FROM recordings WHERE id = ?", [
    req.params.id,
  ]);
  if (!row) return res.status(404).json({ error: "Recording not found" });

  res.sendFile(row.filepath);
});

// ---- Start server ----
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
