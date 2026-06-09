import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthService } from "./auth.service";
import { tokenBlacklist } from "../../db/redis";
import { config } from "../../config";

const authService = new AuthService();

function generateToken(user: { id: string; email: string; name: string; picture?: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, picture: user.picture, jti: crypto.randomUUID(), role: "user" },
    config.jwtSecret,
    { expiresIn: "24h" }
  );
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email.",
        data: { id: user.id, email: user.email, ...(user.otp ? { otp: user.otp } : {}) },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.isProd(),
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const responseData: Record<string, unknown> = {
        success: true,
        message: "Login successful.",
        data: { user: { id: user.id, name: user.name, email: user.email } },
      };

      if ((req as any).isApiRequest) {
        responseData.data = { ...(responseData.data as object), token };
      }

      return res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  },

  async google(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.googleLogin(req.body.credential);
      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.isProd(),
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const responseData: Record<string, unknown> = {
        success: true,
        message: "Google sign-in successful.",
        data: { user: { id: user.id, name: user.name, email: user.email, picture: user.picture } },
      };

      if ((req as any).isApiRequest) {
        responseData.data = { ...(responseData.data as object), token };
      }

      return res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwtSecret) as any;
          if (decoded.jti) {
            await tokenBlacklist.add(decoded.jti, 86400);
          }
        } catch {
          // token already invalid
        }
      }

      res.clearCookie("token", {
        httpOnly: true,
        secure: config.isProd(),
        sameSite: "strict",
      });

      return res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyEmail(req.body.token);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body.token, req.body.password);
      return res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      next(error);
    }
  },
};
