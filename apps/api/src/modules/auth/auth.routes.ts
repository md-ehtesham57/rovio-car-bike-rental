import { Router } from "express";
import * as ctrl from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { authLimiter, passwordResetLimiter } from "../../middleware/ratelimit.middleware";
import {
  registerSchema,
  loginSchema,
  googleSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../lib/schemas";

const router = Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post("/register",        authLimiter,         validate(registerSchema),        ctrl.register);
router.post("/login",           authLimiter,         validate(loginSchema),            ctrl.login);
router.post("/google",          authLimiter,         validate(googleSchema),           ctrl.googleLogin);
router.post("/logout",                                                                  ctrl.logout);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema),  ctrl.forgotPassword);
router.post("/reset-password",  passwordResetLimiter, validate(resetPasswordSchema),   ctrl.resetPassword);

// ─── Admin auth (separate endpoint, stricter limiter) ─────────────────────────
router.post("/admin/login",     authLimiter,         validate(loginSchema),            ctrl.adminLogin);

// ─── Protected ────────────────────────────────────────────────────────────────
router.get("/me", authenticate, ctrl.me);

export default router;
