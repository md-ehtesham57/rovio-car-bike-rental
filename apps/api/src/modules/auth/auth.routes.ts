import { Router } from "express";
import { authController } from "./auth.controller";
import { validate, registerSchema, loginSchema, verifyEmailSchema, googleAuthSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/google", validate(googleAuthSchema), authController.google);
router.post("/logout", authController.logout);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export default router;
