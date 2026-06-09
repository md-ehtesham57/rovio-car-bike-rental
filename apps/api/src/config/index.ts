import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) {
    throw new Error(`CRITICAL: ${key} is missing from environment`);
  }
  return val;
}

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  REDIS_TLS: process.env.REDIS_TLS === "true",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM || "onboarding@resend.dev",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  DB_POOL_SIZE: parseInt(process.env.DB_POOL_SIZE || "10", 10),
} as const;
