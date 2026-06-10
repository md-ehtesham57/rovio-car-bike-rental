"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "user" | "admin" | "seller";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  picture?: string;
  emailVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string; role?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ error?: string; role?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string; data?: Record<string, unknown> }>;
  googleLogin: (credential: string) => Promise<{ error?: string; role?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => { if (!res.ok) throw new Error("Not authenticated"); return res.json(); })
      .then((data)  => { if (data.success) setUser(data.data.user); })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res  = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.success && data.data?.user) { setUser(data.data.user); return { role: data.data.user.role }; }
    return { error: data.message || "Login failed" };
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const res  = await fetch("/api/auth/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (data.success && data.data?.user) { setUser(data.data.user); return { role: data.data.user.role }; }
    return { error: data.message || "Admin login failed" };
  }, []);

  const googleLogin = useCallback(async (credential: string) => {
    const res  = await fetch("/api/auth/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) });
    const data = await res.json();
    if (data.success && data.data?.user) { setUser(data.data.user); return { role: data.data.user.role }; }
    return { error: data.message || "Google sign-in failed" };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    return data.success ? { data: data.data } : { error: data.message || "Registration failed" };
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === "admin", login, adminLogin, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
