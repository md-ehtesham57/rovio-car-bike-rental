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

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function verifyEmail(token: string): Promise<AuthResult> {
  const res = await fetch(`${API_URL}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function logout(token: string): Promise<AuthResult> {
  const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
  });
  return res.json();
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
