"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = await register(name, email, password);
    if (err) {
      setError(err);
    } else {
      setSuccess(true);
    }
    setBusy(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0C0C0E] flex items-center justify-center px-5">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-[#E11D48]/15 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#E11D48">
              <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"/>
            </svg>
          </div>
          <h1 className="font-syne font-semibold text-white text-[1.4rem] mb-2">Check your email</h1>
          <p className="text-white/40 text-[13px] leading-relaxed">
            We&apos;ve sent a verification link to <span className="text-white/60">{email}</span>.<br />
            Please verify your email before signing in.
          </p>
          <Link href="/login" className="inline-block mt-6 text-[#E11D48] hover:text-[#F43F5E] text-[13px] transition-colors">
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

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
          <h1 className="font-syne font-semibold text-white text-[1.6rem] mt-6 mb-1">Create an account</h1>
          <p className="text-white/40 text-[13px]">Join Rovio and start renting</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.07] rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.08] border border-[#E11D48]/[0.15] rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Name</label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors"
          >
            {busy ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-white/30 text-[12px] mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#E11D48] hover:text-[#F43F5E] transition-colors">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
