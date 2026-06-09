"use client";

import { useState, type FormEvent, Suspense, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams, useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

function LoginForm() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = await login(email, password);
    if (!err) {
      router.push(redirect);
    } else {
      setError(err);
    }
    setBusy(false);
  };

  const handleGoogleSuccess = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) return;
    setError(null);
    const err = await googleLogin(response.credential);
    if (!err) {
      router.push(redirect);
    } else {
      setError(err);
    }
  }, [googleLogin, router, redirect]);

  return (
    <main className="min-h-screen bg-[#0C0C0E] flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-[26px] h-[26px] rounded-[5px] bg-[#E11D48] flex items-center justify-center">
              <span className="font-syne font-bold text-white text-[9px]">RV</span>
            </div>
            <span className="font-syne font-semibold text-white text-[15px]">Rovio</span>
          </Link>
          <h1 className="font-syne font-semibold text-white text-[1.6rem] mt-6 mb-1">Welcome back</h1>
          <p className="text-white/40 text-[13px]">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.07] rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.08] border border-[#E11D48]/[0.15] rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.07]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#141416] px-3 text-[11px] text-white/30">or continue with</span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-in failed")}
              theme="filled_black"
              size="large"
              shape="pill"
              text="signin_with"
            />
          </div>
        </form>

        <p className="text-center text-white/30 text-[12px] mt-5">
          Don&apos;t have an account?{" "}
          <Link href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#E11D48] hover:text-[#F43F5E] transition-colors">Create one</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C0C0E] flex items-center justify-center text-white/50 text-[13px]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
