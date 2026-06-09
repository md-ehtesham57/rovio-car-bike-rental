import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { fail } from "../types";
import { config } from "../config";

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const issues = err.issues;
    const message = issues[0]?.message || "Validation failed";
    res.status(400).json({
      ...fail(message),
      errors: issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }

  // Known app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(fail(err.message));
    return;
  }

  // Mongoose duplicate key
  if (
    err instanceof mongoose.mongo.MongoServerError &&
    err.code === 11000
  ) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "field";
    res.status(409).json(fail(`${field} already exists`));
    return;
  }

  // Mongoose cast error (bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json(fail(`Invalid ${err.path}`));
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)[0]?.message || "Validation failed";
    res.status(400).json(fail(message));
    return;
  }

  // Unknown — log full error in dev, hide details in prod
  console.error("[Error]", err);
  const message = config.isDev() && err instanceof Error
    ? err.message
    : "Internal server error";
  res.status(500).json(fail(message));
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json(fail("Route not found"));
}