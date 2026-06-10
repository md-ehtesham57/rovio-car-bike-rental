import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { ok } from "../../types";
import type { AuthRequest } from "../../types";
import { config } from "../../config";

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   config.isProd(),
  sameSite: "strict" as const,
  maxAge:   24 * 60 * 60 * 1000,
  path:     "/",
};

// ─── User auth ────────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    const result = await authService.register(name, email, password);
    res.cookie("token", result.token, COOKIE_OPTS);
    res.status(201).json(ok("Registration successful.", { user: result.user, token: result.token }));
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.login(email, password);
    res.cookie("token", result.token, COOKIE_OPTS);
    res.json(ok("Login successful.", { user: result.user, token: result.token }));
  } catch (err) { next(err); }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { credential } = req.body as { credential: string };
    const result = await authService.googleAuth(credential);
    res.cookie("token", result.token, COOKIE_OPTS);
    res.json(ok("Google sign-in successful.", { user: result.user, token: result.token }));
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (token) await authService.logout(token);
    res.clearCookie("token", { path: "/" });
    res.json(ok("Logged out successfully."));
  } catch (err) { next(err); }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json(ok("Authenticated.", { user: req.user }));
  } catch (err) { next(err); }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body as { email: string };
    await authService.forgotPassword(email);
    res.json(ok("If that email is registered, a reset link has been sent."));
  } catch (err) { next(err); }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body as { token: string; password: string };
    await authService.resetPassword(token, password);
    res.json(ok("Password reset successful. You can now log in."));
  } catch (err) { next(err); }
}

// ─── Admin auth ───────────────────────────────────────────────────────────────

export async function adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.adminLogin(email, password);
    res.cookie("admin_token", result.token, { ...COOKIE_OPTS, path: "/admin" });
    res.cookie("token", result.token, COOKIE_OPTS);
    res.json(ok("Admin login successful.", { user: result.user, token: result.token }));
  } catch (err) { next(err); }
}
