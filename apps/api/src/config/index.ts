import "dotenv/config";

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const config = {
  env: optional("NODE_ENV", "development") as "development" | "production" | "test",
  port: parseInt(optional("PORT", "5000"), 10),

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: optional("JWT_EXPIRES_IN", "24h"),
  jwtRefreshSecret: optional("JWT_REFRESH_SECRET", ""),
  jwtRefreshExpiresIn: optional("JWT_REFRESH_EXPIRES_IN", "7d"),

  apiKey: optional("API_KEY", ""),

  mongoUri: optional("MONGO_URI", optional("MONGODB_URI", "mongodb://127.0.0.1:27017/rovio")),
  redisUrl: optional("REDIS_URL", `redis://${optional("REDIS_HOST", "127.0.0.1")}:${optional("REDIS_PORT", "6379")}`),
  redisHost: optional("REDIS_HOST", "127.0.0.1"),
  redisPort: parseInt(optional("REDIS_PORT", "6379"), 10),
  redisPassword: optional("REDIS_PASSWORD", ""),
  redisTls: optional("REDIS_TLS", "false") === "true",

  googleClientId: optional("GOOGLE_CLIENT_ID", ""),

  resendApiKey: optional("RESEND_API_KEY", ""),
  mailFrom: optional("MAIL_FROM", "onboarding@resend.dev"),

  appUrl: optional("APP_URL", "http://localhost:3000"),
  corsOrigin: optional("CORS_ORIGIN", "http://localhost:3000"),
  frontendUrl: optional("FRONTEND_URL", "http://localhost:3000"),

  dbPoolSize: parseInt(optional("DB_POOL_SIZE", "10"), 10),

  rateLimits: {
    auth: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(optional("RATE_AUTH_MAX", "20"), 10),
    },
    global: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(optional("RATE_GLOBAL_MAX", "200"), 10),
    },
    admin: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(optional("RATE_ADMIN_MAX", "60"), 10),
    },
  },

  isDev(): boolean { return this.env === "development"; },
  isProd(): boolean { return this.env === "production"; },
  isTest(): boolean { return this.env === "test"; },
} as const;

/** Backward-compat alias for files that import `env` */
export const env = {
  NODE_ENV: config.env,
  PORT: config.port,
  JWT_SECRET: config.jwtSecret,
  API_KEY: config.apiKey,
  MONGO_URI: config.mongoUri,
  REDIS_HOST: config.redisHost,
  REDIS_PORT: config.redisPort,
  REDIS_PASSWORD: config.redisPassword,
  REDIS_TLS: config.redisTls,
  CORS_ORIGIN: config.corsOrigin,
  RESEND_API_KEY: config.resendApiKey,
  MAIL_FROM: config.mailFrom,
  FRONTEND_URL: config.frontendUrl,
  GOOGLE_CLIENT_ID: config.googleClientId,
  DB_POOL_SIZE: config.dbPoolSize,
};
