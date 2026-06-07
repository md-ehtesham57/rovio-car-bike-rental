import jwt from "jsonwebtoken";

const AUTH_URL = process.env.LEMU_AUTH_URL || "http://localhost:5000";
const API_KEY = process.env.LEMU_API_KEY || "";
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

function headers() {
  return {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  return data;
}

export async function verifyEmail(token: string): Promise<AuthResult> {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/verify-email`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  return data;
}

export async function logout(token: string): Promise<AuthResult> {
  const res = await fetch(`${AUTH_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      ...headers(),
      Cookie: `token=${token}`,
    },
  });
  const data = await res.json();
  return data;
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
