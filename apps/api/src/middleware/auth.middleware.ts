import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthRequest, JwtPayload, fail } from "../types";
import { redis } from "../db/redis";

// ─── JWT authenticate ─────────────────────────────────────────────────────────

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json(fail("Authentication required"));
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // Check revocation list (logout blacklist)
    const revoked = await redis.get(`revoked:${payload.jti}`);
    if (revoked) {
      res.status(401).json(fail("Token has been revoked"));
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json(fail("Token expired"));
    } else {
      res.status(401).json(fail("Invalid token"));
    }
  }
}

// ─── Role guard — call AFTER authenticate ─────────────────────────────────────

export function requireRole(...roles: Array<"user" | "admin">) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(fail("Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json(fail("Insufficient permissions"));
      return;
    }
    next();
  };
}

/** Convenience — require admin role */
export const requireAdmin = [authenticate, requireRole("admin")];

// ─── Internal API key guard (Next.js → API service calls) ─────────────────────

export function apiKeyGuard(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (!config.apiKey) return next();

  const key = req.headers["x-api-key"];
  if (key === config.apiKey) {
    (req as any).isApiRequest = true;
  }

  next();
}