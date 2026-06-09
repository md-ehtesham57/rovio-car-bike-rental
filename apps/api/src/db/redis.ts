import Redis from "ioredis";
import { env } from "../config";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  tls: env.REDIS_TLS ? {} : undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export class TokenBlacklistService {
  async add(jti: string, ttlSeconds: number) {
    try {
      await redis.set(`bl:${jti}`, "1", "EX", ttlSeconds);
    } catch {
      // degraded
    }
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    try {
      const result = await redis.get(`bl:${jti}`);
      return result !== null;
    } catch {
      return false;
    }
  }

  async close() {
    try {
      await redis.quit();
    } catch {
      // already closed
    }
  }
}

export const tokenBlacklist = new TokenBlacklistService();
