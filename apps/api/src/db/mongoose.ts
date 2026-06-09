import mongoose from "mongoose";
import { env } from "../config";

let connected = false;

export function isConnected() {
  return connected;
}

export async function connectDB() {
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await mongoose.connect(env.MONGO_URI, {
        dbName: "rovio",
        maxPoolSize: env.DB_POOL_SIZE,
        serverSelectionTimeoutMS: 5000,
      });
      connected = true;
      console.log("MongoDB connected");
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1}/${MAX_RETRIES} failed:`, (err as Error).message);
      if (i < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  console.warn("MongoDB unavailable — server will still start, but DB operations will fail");
}
