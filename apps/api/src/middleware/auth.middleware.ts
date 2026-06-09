import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config";
import { tokenBlacklist } from "../db/redis";
import type { UserPayload } from "../types";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;

    if (decoded.jti) {
      const blacklisted = await tokenBlacklist.isBlacklisted(decoded.jti);
      if (blacklisted) {
        return res.status(401).json({ success: false, message: "Token has been revoked" });
      }
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function apiKeyGuard(req: Request, _res: Response, next: NextFunction) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return next();

  const providedKey = req.headers["x-api-key"];
  if (providedKey && providedKey === apiKey) {
    req.isApiRequest = true;
  }

  next();
}
