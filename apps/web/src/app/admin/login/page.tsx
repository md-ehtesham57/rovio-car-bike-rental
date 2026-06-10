"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState<string | null>(null);
  const [busy,     setBusy]     = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await adminLogin(email, password);
    if (!result.error) {
      router.push("/admin/dashboard");
    } else {
      setError(result.error);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0C0E] flex items-center justify-center px-5">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 bg-[#141416] border border-white/[0.07] rounded-full px-4 py-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#E11D48] flex items-center justify-center">
              <span className="font-syne font-bold text-white text-[7px]">RV</span>
            </div>
            <span className="font-syne font-semibold text-white text-[13px]">Rovio</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[#E11D48] text-[11px] font-medium tracking-[0.06em] uppercase">Admin</span>
          </div>
        </div>

        <div className="text-center mb-7">
          <h1 className="font-syne font-bold text-white text-[1.7rem] mb-1">Admin access</h1>
          <p className="text-white/35 text-[13px]">Restricted to authorised administrators only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.07] rounded-xl p-6 space-y-4">
          {error && (
            <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.07] border border-[#E11D48]/20 rounded-lg px-3.5 py-2.5 leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/40 text-[10px] font-medium mb-1.5 tracking-[0.06em] uppercase">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rovio.in"
              className="w-full bg-[#0C0C0E] border border-white/[0.09] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/40 text-[10px] font-medium mb-1.5 tracking-[0.06em] uppercase">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0C0C0E] border border-white/[0.09] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors mt-1"
          >
            {busy ? "Verifying…" : "Sign in to Admin"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between px-1">
          <Link href="/" className="text-[11px] text-white/25 hover:text-white/50 transition-colors">
            ← Back to site
          </Link>
          <span className="text-[11px] text-white/20">Rovio © 2025</span>
        </div>

        {/* Security notice */}
        <p className="mt-4 text-center text-[11px] text-white/20 leading-relaxed">
          All activity in this panel is logged and monitored.
        </p>
      </div>
    </main>
  );
}
