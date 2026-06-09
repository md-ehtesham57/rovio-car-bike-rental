import rateLimit from "express-rate-limit";
import { config } from "../config";
import { fail } from "../types";

function makeMessage(message: string) {
  return (_req: unknown, res: { json: (body: unknown) => void }) =>
    res.json(fail(message));
}

/** Applied to all /api routes — broad safety net */
export const globalLimiter = rateLimit({
  windowMs: config.rateLimits.global.windowMs,
  max:      config.rateLimits.global.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: makeMessage("Too many requests. Please slow down."),
  skip: (req) => req.path === "/health",
});

/** Login + register endpoints — tightest limit */
export const authLimiter = rateLimit({
  windowMs: config.rateLimits.auth.windowMs,
  max:      config.rateLimits.auth.max,
  standardHeaders: true,
  legacyHeaders:   false,
  keyGenerator: (req) => {
    // Key by IP + email combo to prevent credential-stuffing from a single IP
    const email = (req.body as Record<string, unknown>)?.email;
    const ip    = req.ip ?? "unknown";
    return email ? `${ip}:${String(email).toLowerCase()}` : ip;
  },
  message: makeMessage("Too many auth attempts. Try again in 15 minutes."),
});

/** OTP resend — prevent email bombing */
export const otpLimiter = rateLimit({
  windowMs: config.rateLimits.otp.windowMs,
  max:      config.rateLimits.otp.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: makeMessage("Too many OTP requests. Try again in 1 hour."),
});

/** Admin routes */
export const adminLimiter = rateLimit({
  windowMs: config.rateLimits.admin.windowMs,
  max:      config.rateLimits.admin.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message: makeMessage("Too many admin requests. Slow down."),
});

/** Password reset — prevent abuse */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders:   false,
  message: makeMessage("Too many password reset attempts. Try again in 1 hour."),
});