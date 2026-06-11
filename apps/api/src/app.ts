import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { config } from "./config";
import authRoutes    from "./modules/auth/auth.routes";
import vehiclesRoutes from "./modules/vehicles/vehicles.routes";
import sellerRoutes  from "./modules/seller/seller.routes";
import adminRoutes   from "./modules/admin/admin.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import { apiKeyGuard } from "./middleware/auth.middleware";
import { globalLimiter } from "./middleware/ratelimit.middleware";
import bookingRoutes from "./modules/bookings/booking.routes";

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: config.isProd() ? undefined : false,
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      config.appUrl,
  credentials: true,
  methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
}));

// ─── Body + cookies ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── Global rate limiter ──────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Static files (uploaded images) ────────────────────────────────────────────
app.use("/uploads", express.static(path.resolve("uploads")));

// ─── Health check (public, no API key) ───────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status:    "ok",
    service:   "rovio-api",
    env:       config.env,
    timestamp: new Date().toISOString(),
  });
});

// ─── All /api/v1 routes are protected by the internal API key ─────────────────
// The Next.js server sends this key; browsers cannot access these routes directly
app.use("/api/v1", apiKeyGuard);

app.use("/api/v1/auth",     authRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/seller",   sellerRoutes);
app.use("/api/v1/admin",    adminRoutes);
app.use("/api/v1/bookings", bookingRoutes);
// ─── 404 + global error handler ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
