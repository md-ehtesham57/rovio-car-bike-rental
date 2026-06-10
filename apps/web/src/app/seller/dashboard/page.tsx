"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SellerStats = {
  totalVehicles: number;
  activeVehicles: number;
  pendingVehicles: number;
  totalBookings: number;
  revenue: number;
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex items-center gap-2 text-white/30 text-[13px]">
      <span className="animate-spin">◌</span> Loading…
    </div>
  );

  return (
    <div className="p-7 max-w-[900px]">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Seller Dashboard</h1>
        <p className="text-white/30 text-[12px] mt-0.5">Manage your listings and track performance</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Vehicles",  value: fmt(stats?.totalVehicles ?? 0),     sub: "all time" },
          { label: "Active",          value: fmt(stats?.activeVehicles ?? 0),    sub: "currently listed" },
          { label: "Pending Review", value: fmt(stats?.pendingVehicles ?? 0),   sub: "awaiting approval" },
          { label: "Revenue",         value: `₹${fmt(stats?.revenue ?? 0)}`,     sub: "all time" },
        ].map((c) => (
          <div key={c.label} className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
            <p className="text-white/40 text-[11px] tracking-[0.04em] uppercase font-medium mb-2">{c.label}</p>
            <p className="font-syne font-bold text-white text-[1.6rem] leading-none mb-1">{c.value}</p>
            <p className="text-white/30 text-[11px]">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/seller/vehicles/new"
          className="flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-all">
          + Add vehicle
        </Link>
        <Link href="/seller/vehicles"
          className="flex items-center text-white/40 hover:text-white/70 text-[13px] px-5 py-2.5 border border-white/[0.08] rounded-lg transition-all">
          View all vehicles →
        </Link>
      </div>
    </div>
  );
}
