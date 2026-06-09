import jwt from "jsonwebtoken";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const JWT_SECRET = process.env.JWT_SECRET || "";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResult = {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
};

async function apiFetch(path: string, options: RequestInit = {}): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    return res.json();
  } catch {
    return { success: false, message: "Service unavailable. Please try again later." };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyEmail(token: string): Promise<AuthResult> {
  return apiFetch("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function logout(token: string): Promise<AuthResult> {
  return apiFetch("/api/v1/auth/logout", {
    method: "POST",
    headers: { Cookie: `token=${token}` },
  });
}

export type DecodedToken = {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
  jti?: string;
};

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

export function parseToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken | null;
  } catch {
    return null;
  }
}
