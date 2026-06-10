"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totals: {
    users: number; vehicles: number; bookings: number;
    activeBookings: number; pendingVehicles: number;
    revenue: number; revenueThisMonth: number;
  };
  bookingsByStatus: Record<string, number>;
  vehiclesByCategory: Record<string, number>;
  recentBookings: Array<{
    _id: string;
    status: string;
    totalPrice: number;
    totalDays: number;
    createdAt: string;
    userId: { name: string; email: string } | null;
    vehicleId: { name: string; brand: string; emoji: string } | null;
  }>;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10",
  active:    "text-green-400 bg-green-400/10",
  completed: "text-white/40 bg-white/[0.06]",
  cancelled: "text-red-400 bg-red-400/10",
  pending:   "text-yellow-400 bg-yellow-400/10",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); else setError(d.message); })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center gap-2 text-white/30 text-[13px]">
      <span className="animate-spin">◌</span> Loading…
    </div>
  );

  if (error || !stats) return (
    <div className="p-8 text-[#E11D48] text-[13px]">{error || "No data"}</div>
  );

  const { totals, bookingsByStatus, vehiclesByCategory, recentBookings } = stats;

  const METRIC_CARDS = [
    { label: "Total Users",      value: fmt(totals.users),            sub: "registered accounts",       accent: false },
    { label: "Total Vehicles",   value: fmt(totals.vehicles),         sub: `${totals.pendingVehicles} pending review`, accent: totals.pendingVehicles > 0 },
    { label: "Active Bookings",  value: fmt(totals.activeBookings),   sub: `${fmt(totals.bookings)} total bookings`,  accent: false },
    { label: "Revenue",          value: `₹${fmt(totals.revenue)}`,    sub: `₹${fmt(totals.revenueThisMonth)} this month`, accent: false },
  ];

  return (
    <div className="p-7 max-w-[1100px]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Dashboard</h1>
        <p className="text-white/30 text-[12px] mt-0.5">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {METRIC_CARDS.map((c) => (
          <div key={c.label} className={`bg-[#141416] border rounded-xl p-5 ${c.accent ? "border-[#E11D48]/30" : "border-white/[0.06]"}`}>
            <p className="text-white/40 text-[11px] tracking-[0.04em] uppercase font-medium mb-2">{c.label}</p>
            <p className={`font-syne font-bold text-[1.6rem] leading-none mb-1 ${c.accent ? "text-[#E11D48]" : "text-white"}`}>{c.value}</p>
            <p className="text-white/30 text-[11px]">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-[#141416] border border-white/[0.06] rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
            <h2 className="font-syne font-semibold text-white text-[13px]">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentBookings.length === 0 && (
              <p className="px-5 py-6 text-white/25 text-[12px]">No bookings yet.</p>
            )}
            {recentBookings.map((b) => (
              <div key={b._id} className="px-5 py-3.5 flex items-center gap-4">
                <span className="text-xl leading-none shrink-0">{b.vehicleId?.emoji || "🚗"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[12px] font-medium truncate">
                    {b.vehicleId ? `${b.vehicleId.brand} ${b.vehicleId.name}` : "—"}
                  </p>
                  <p className="text-white/35 text-[11px] truncate">{b.userId?.name || "—"} · {b.totalDays}d</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white text-[12px] font-medium">₹{fmt(b.totalPrice)}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[b.status] || "text-white/30 bg-white/[0.05]"}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Bookings by status */}
          <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-syne font-semibold text-white text-[13px] mb-4">Bookings by Status</h2>
            <div className="space-y-2.5">
              {Object.entries(bookingsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[status] || "text-white/30"}`}>
                    {status}
                  </span>
                  <span className="text-white/60 text-[12px] font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicles by category */}
          <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-syne font-semibold text-white text-[13px] mb-4">Vehicles by Category</h2>
            <div className="space-y-2.5">
              {Object.entries(vehiclesByCategory).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-white/50 text-[12px]">{cat}</span>
                  <span className="text-white/60 text-[12px] font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
            <h2 className="font-syne font-semibold text-white text-[13px] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {totals.pendingVehicles > 0 && (
                <Link href="/admin/vehicles?status=pending_review" className="flex items-center justify-between bg-[#E11D48]/[0.07] hover:bg-[#E11D48]/[0.12] border border-[#E11D48]/20 rounded-lg px-3.5 py-2.5 transition-all group">
                  <span className="text-[12px] text-white/70 group-hover:text-white transition-colors">Review pending vehicles</span>
                  <span className="text-[#E11D48] text-[11px] font-semibold">{totals.pendingVehicles}</span>
                </Link>
              )}
              <Link href="/admin/users" className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg px-3.5 py-2.5 transition-all">
                <span className="text-[12px] text-white/50">Manage users</span>
                <span className="text-white/30 text-[12px]">→</span>
              </Link>
              <Link href="/admin/bookings" className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg px-3.5 py-2.5 transition-all">
                <span className="text-[12px] text-white/50">View all bookings</span>
                <span className="text-white/30 text-[12px]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
