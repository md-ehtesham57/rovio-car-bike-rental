import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { config } from "../../config";
import { redis } from "../../db/redis";
import { User } from "./user.model";
import { AppError } from "../../middleware/error.middleware";
import { mailQueue } from "../../delivery/queues/mail.queue";
import type { JwtPayload } from "../../types";

const googleClient = config.googleClientId
  ? new OAuth2Client(config.googleClientId)
  : null;

const TOKEN_TTL     = 24 * 60 * 60;   // 24 h
const LOCK_WINDOW   = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS  = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function signToken(payload: Omit<JwtPayload, "jti">): string {
  const jti = uuidv4();
  return jwt.sign({ ...payload, jti }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
}

function sanitizeUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  picture?: string;
  emailVerified?: boolean;
  isBanned?: boolean;
  lastLoginAt?: Date;
}) {
  return {
    id:            user._id.toString(),
    name:          user.name,
    email:         user.email,
    role:          user.role as "user" | "admin" | "seller",
    picture:       user.picture,
    emailVerified: user.emailVerified,
    isBanned:      user.isBanned ?? false,
    lastLoginAt:   user.lastLoginAt,
  };
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(name: string, email: string, password: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already registered", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name, email, passwordHash,
    emailVerified: true,
  });

  const safe = sanitizeUser(user);
  const token = signToken(safe);
  return { user: safe, token };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select(
    "+passwordHash +loginAttempts +lockUntil",
  );
  if (!user || !user.passwordHash) throw new AppError("Invalid credentials", 401);

  // Brute-force check
  if (user.isLocked()) {
    const remainMs = user.lockUntil!.getTime() - Date.now();
    const remainMin = Math.ceil(remainMs / 60000);
    throw new AppError(
      `Account locked due to too many failed attempts. Try again in ${remainMin} minute${remainMin !== 1 ? "s" : ""}.`,
      423,
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1;
    const update: Record<string, unknown> = { loginAttempts: attempts };
    if (attempts >= MAX_ATTEMPTS) {
      update.lockUntil = new Date(Date.now() + LOCK_WINDOW);
    }
    await User.findByIdAndUpdate(user._id, update);
    const remaining = MAX_ATTEMPTS - attempts;
    if (remaining <= 0) {
      throw new AppError("Account locked for 15 minutes due to too many failed attempts.", 423);
    }
    throw new AppError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`, 401);
  }

  // Reset on success
  await User.findByIdAndUpdate(user._id, {
    loginAttempts: 0,
    $unset: { lockUntil: 1 },
    lastLoginAt: new Date(),
  });

  const safe = sanitizeUser(user);
  const token = signToken(safe);
  return { user: safe, token };
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function googleAuth(credential: string) {
  if (!googleClient) throw new AppError("Google OAuth is not configured", 500);

  const ticket = await googleClient.verifyIdToken({
    idToken:  credential,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError("Invalid Google token", 400);

  let user = await User.findOne({ email: payload.email });

  if (user) {
    if (!user.googleId) {
      user.googleId       = payload.sub;
      user.picture        = payload.picture;
      user.emailVerified  = true;
      user.lastLoginAt    = new Date();
      await user.save();
    } else {
      await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });
    }
  } else {
    user = await User.create({
      name:          payload.name || payload.email.split("@")[0],
      email:         payload.email,
      googleId:      payload.sub,
      picture:       payload.picture,
      emailVerified: true,
      lastLoginAt:   new Date(),
    });
  }

  const safe = sanitizeUser(user);
  const token = signToken(safe);
  return { user: safe, token };
}

// ─── Admin login (email/password only, no Google, stricter) ──────────────────

export async function adminLogin(email: string, password: string) {
  const user = await User.findOne({ email, role: "admin" }).select(
    "+passwordHash +loginAttempts +lockUntil",
  );

  // Constant-time guard — don't reveal whether admin exists
  if (!user || !user.passwordHash) {
    await bcrypt.compare(password, "$2b$12$invalidhashpadding000000000000000000000000000000000000");
    throw new AppError("Invalid credentials", 401);
  }

  if (user.isLocked()) {
    throw new AppError("Account temporarily locked. Please try again later.", 423);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const attempts = (user.loginAttempts || 0) + 1;
    const update: Record<string, unknown> = { loginAttempts: attempts };
    if (attempts >= MAX_ATTEMPTS) update.lockUntil = new Date(Date.now() + LOCK_WINDOW);
    await User.findByIdAndUpdate(user._id, update);
    throw new AppError("Invalid credentials", 401);
  }

  await User.findByIdAndUpdate(user._id, {
    loginAttempts: 0,
    $unset: { lockUntil: 1 },
    lastLoginAt: new Date(),
  });

  const safe = sanitizeUser(user);
  const token = signToken(safe);
  return { user: safe, token };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(token: string) {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const ttl = decoded?.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : TOKEN_TTL;
    if (ttl > 0) await redis.setex(`revoked:${payload.jti}`, ttl, "1");
  } catch {
    // Already invalid — nothing to revoke
  }
}

// ─── Forgot / Reset password ──────────────────────────────────────────────────

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  // Always respond the same to prevent email enumeration
  if (!user) return;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  await User.findByIdAndUpdate(user._id, {
    passwordResetToken:   hashedToken,
    passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 h
  });

  const resetUrl = `${config.appUrl}/reset-password?token=${rawToken}`;
  await mailQueue.add("send-mail", {
    type: "password-reset",
    email,
    name: user.name,
    token: resetUrl,
  }, { attempts: 3, backoff: { type: "exponential", delay: 1000 } });
}

export async function resetPassword(rawToken: string, newPassword: string) {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken:   hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) throw new AppError("Reset token is invalid or has expired", 400);

  user.passwordHash         = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken   = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts        = 0;
  user.lockUntil            = undefined;
  await user.save();
}
