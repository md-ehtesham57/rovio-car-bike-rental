import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { apiKeyGuard } from "./middleware/auth.middleware";
import { env } from "./config";

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

// Logging
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Body size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Global rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

// API key guard for service-to-service
app.use(apiKeyGuard);

// Auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use("/api/v1/auth", authLimiter, authRoutes);

// Error handler
app.use(errorMiddleware);

export default app;
