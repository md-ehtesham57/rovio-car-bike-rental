"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/seller/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/seller/vehicles",  label: "My Vehicles", icon: "⊟" },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0C0C0E] flex">
      <aside className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[5px] bg-[#E11D48] flex items-center justify-center">
              <span className="font-syne font-bold text-white text-[8px]">RV</span>
            </div>
            <div>
              <span className="font-syne font-semibold text-white text-[13px] leading-none">Rovio</span>
              <span className="block text-[#E11D48] text-[9px] font-medium tracking-[0.07em] uppercase mt-0.5">Seller</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                  active
                    ? "bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/15"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-[14px] leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-[#E11D48]/20 flex items-center justify-center shrink-0">
              <span className="text-[#E11D48] text-[9px] font-semibold font-syne">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-white/70 truncate">{user?.name || "Seller"}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-white/30 hover:text-[#E11D48] hover:bg-[#E11D48]/[0.06] transition-all"
          >
            <span className="text-[12px]">↩</span>
            Sign out
          </button>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] text-white/20 hover:text-white/40 transition-all"
          >
            <span className="text-[12px]">↗</span>
            View site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
