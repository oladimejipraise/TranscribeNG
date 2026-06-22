import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes       from "./routes/auth.js";
import transcriptRoutes from "./routes/transcripts.js";
import exportRoutes     from "./routes/export.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",        authRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/export",      exportRoutes);

app.get("/health", (_, res) => res.json({ status: "ok", service: "transcribeng-api" }));

app.use((_, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;