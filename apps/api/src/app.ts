import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import { apiKeyGuard } from "./middleware/auth.middleware";
import { config } from "./config";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(morgan(config.isDev() ? "dev" : "combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(
  rateLimit({
    windowMs: config.rateLimits.global.windowMs,
    max: config.rateLimits.global.max,
    message: { success: false, message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === "/health",
  })
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use(apiKeyGuard);

const authLimiter = rateLimit({
  windowMs: config.rateLimits.auth.windowMs,
  max: config.rateLimits.auth.max,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1/auth", authLimiter, authRoutes);

app.use(errorHandler);

export default app;
