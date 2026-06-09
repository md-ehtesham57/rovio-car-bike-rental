import { Request } from "express";

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function ok<T>(message: string, data?: T): ApiResponse<T> {
  return { success: true, message, ...(data !== undefined ? { data } : {}) };
}

export function fail(message: string): ApiResponse {
  return { success: false, message };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  picture?: string;
  jti: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedData<T> {
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}