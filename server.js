import "dotenv/config";
import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads", {
  dotfiles: "deny",
  index: false,
  fallthrough: true,
}));

app.use("/api", uploadRoutes);

app.get("/", (_req, res) => res.json({ ok: true, service: "threadbase-upload-server" }));

app.use((err, _req, res, _next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 5 MB." });
  }
  if (err?.code === "LIMIT_FILE_COUNT" || err?.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ error: "Upload exactly one image using the 'avatar' field." });
  }
  if (err?.status === 400) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
