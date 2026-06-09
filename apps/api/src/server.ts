import app from "./app";
import { env } from "./config";
import { connectDB } from "./db/mongoose";
import { mailQueue } from "./delivery/queues/mail.queue";
import { redis, tokenBlacklist } from "./db/redis";
import mongoose from "mongoose";

let server: ReturnType<typeof app.listen>;

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

async function main() {
  await connectDB();

  server = app.listen(env.PORT, () => {
    console.log(`API server running on port ${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  try {
    await mailQueue.close();
    console.log("Mail queue closed.");
  } catch (e) {
    console.error("Error closing mail queue:", (e as Error).message);
  }

  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (e) {
    console.error("Error disconnecting MongoDB:", (e as Error).message);
  }

  try {
    await tokenBlacklist.close();
    console.log("Token blacklist client closed.");
  } catch (e) {
    console.error("Error closing blacklist client:", (e as Error).message);
  }

  try {
    await redis.quit();
    console.log("Redis client closed.");
  } catch {
    // already closed
  }

  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
