import { Router } from "express";
import upload from "../config/upload.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/upload", verifyToken, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "An image file is required in the 'avatar' field" });
  }

  const url = `/uploads/${encodeURIComponent(req.file.filename)}`;
  return res.status(201).json({
    message: "File uploaded successfully",
    url,
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

export default router;
