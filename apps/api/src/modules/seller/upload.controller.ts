import { Response, NextFunction } from "express";
import type { AuthRequest } from "../../types";
import { ok } from "../../types";

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided." });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json(ok("Image uploaded.", { url }));
  } catch (err) { next(err); }
}

export async function deleteImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filename = String(req.params.filename);
    const filepath = path.resolve("uploads", filename);

    try {
      await fs.access(filepath);
      await fs.unlink(filepath);
    } catch {
      return res.status(404).json({ success: false, message: "File not found." });
    }
    res.json(ok("Image deleted."));
  } catch (err) { next(err); }
}
