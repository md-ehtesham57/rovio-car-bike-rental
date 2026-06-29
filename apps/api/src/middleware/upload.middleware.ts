import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const UPLOADS_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const FILE_TYPES = /jpeg|jpg|png|webp|avif/;

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extOk = FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = FILE_TYPES.test(file.mimetype.split("/")[1]);
    cb(null, extOk || mimeOk);
  },
});
