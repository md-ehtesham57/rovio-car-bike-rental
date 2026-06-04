"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#0C0C0E] pt-[60px]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-syne font-semibold text-white text-[1.6rem]">Profile</h1>
          <button
            onClick={logout}
            className="text-[12px] text-white/40 hover:text-[#E11D48] border border-white/[0.1] hover:border-[#E11D48]/30 px-4 py-2 rounded-md transition-all"
          >
            Sign out
          </button>
        </div>

        <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-[#E11D48]/15 flex items-center justify-center mb-4">
            <span className="font-syne font-semibold text-[#E11D48] text-[16px]">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>

          <dl className="space-y-3">
            <div>
              <dt className="text-white/40 text-[11px] tracking-[0.04em] uppercase">Name</dt>
              <dd className="text-white text-[14px] mt-0.5">{user?.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40 text-[11px] tracking-[0.04em] uppercase">Email</dt>
              <dd className="text-white text-[14px] mt-0.5">{user?.email || "—"}</dd>
            </div>
          </dl>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="text-[12px] text-white/30 hover:text-white/60 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
