"use client";

import { useState, type FormEvent, useRef, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

function RegisterForm() {
  const { register, login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await register(name, email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      if (result.data?.otp) setOtpHint(result.data.otp as string);
    }
    setBusy(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Enter the full 6-digit code");
      return;
    }
    setOtpError(null);
    setOtpBusy(true);
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!data.success) {
      setOtpError(data.message || "Invalid code");
      setOtpBusy(false);
      return;
    }
    setOtpVerified(true);
    await login(email, password);
    router.push(redirect);
  };

  if (otpVerified) {
    return (
      <main className="min-h-screen bg-[#0C0C0E] flex items-center justify-center px-5">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-[#E11D48]/15 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#E11D48">
              <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"/>
            </svg>
          </div>
          <h1 className="font-syne font-semibold text-white text-[1.4rem] mb-2">Email verified!</h1>
          <p className="text-white/40 text-[13px] leading-relaxed">
            Redirecting you to <span className="text-white/60">{redirect}</span>...
          </p>
        </div>
      </main>
    );
  }

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
            We&apos;ve sent a 6-digit code to <span className="text-white/60">{email}</span>.<br />
            Enter it below to verify your account.
          </p>
          {otpHint && (
            <div className="mt-3 px-4 py-2.5 bg-[#E11D48]/[0.08] border border-[#E11D48]/[0.15] rounded-lg">
              <p className="text-white/40 text-[10px] tracking-[0.06em] uppercase">Dev hint</p>
              <p className="text-[#E11D48] text-[24px] font-mono font-bold tracking-[0.15em]">{otpHint}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 bg-[#141416] border border-white/[0.1] rounded-lg text-white text-center text-lg font-medium outline-none focus:border-[#E11D48]/50 transition-colors"
                />
              ))}
            </div>
            {otpError && (
              <p className="text-[#E11D48] text-[12px] mt-3">{otpError}</p>
            )}
            <button
              onClick={handleOtpSubmit}
              disabled={otpBusy}
              className="mt-4 w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors"
            >
              {otpBusy ? "Verifying..." : "Verify email"}
            </button>
          </div>
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
              text="signup_with"
            />
          </div>
        </form>

        <p className="text-center text-white/30 text-[12px] mt-5">
          Already have an account?{" "}
          <Link href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-[#E11D48] hover:text-[#F43F5E] transition-colors">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C0C0E] flex items-center justify-center text-white/50 text-[13px]">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
