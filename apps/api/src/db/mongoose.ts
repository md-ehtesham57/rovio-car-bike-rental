import mongoose from "mongoose";
import { env } from "../config";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: "rovio",
      maxPoolSize: env.DB_POOL_SIZE,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
}
