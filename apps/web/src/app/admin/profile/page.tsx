"use client";

import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function AdminProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-7 max-w-[600px]">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Profile</h1>
        <p className="text-white/30 text-[12px] mt-0.5">Your admin account details</p>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
          <div className="w-14 h-14 rounded-full bg-[#E11D48]/15 flex items-center justify-center overflow-hidden shrink-0">
            {user?.picture ? (
              <Image src={user.picture} alt="" width={56} height={56} className="w-full h-full object-cover" />
            ) : (
              <span className="font-syne font-bold text-[#E11D48] text-[20px]">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            )}
          </div>
          <div>
            <p className="font-syne font-semibold text-white text-[15px]">{user?.name || "—"}</p>
            <p className="text-white/40 text-[12px]">{user?.email || "—"}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold tracking-[0.06em] uppercase text-[#E11D48] bg-[#E11D48]/10 border border-[#E11D48]/20 rounded-full px-2.5 py-0.5">
              ✦ Admin
            </span>
          </div>
        </div>

        {/* Details */}
        <dl className="space-y-4">
          {[
            { label: "Full Name",   value: user?.name  || "—" },
            { label: "Email",       value: user?.email || "—" },
            { label: "Role",        value: "Administrator" },
            { label: "Verified",    value: user?.emailVerified ? "Yes" : "No" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-white/35 text-[11px] tracking-[0.04em] uppercase font-medium">{label}</dt>
              <dd className="text-white/80 text-[13px]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 pt-5 border-t border-white/[0.06]">
          <button
            onClick={logout}
            className="w-full bg-[#E11D48]/[0.08] hover:bg-[#E11D48]/[0.14] border border-[#E11D48]/20 text-[#E11D48] text-[12px] font-medium py-2.5 rounded-lg transition-all"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
