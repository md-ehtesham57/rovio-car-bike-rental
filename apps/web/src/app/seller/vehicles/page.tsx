"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Vehicle = {
  _id: string; name: string; brand: string; emoji: string;
  pricePerDay: number; status: string; available: boolean;
  categories: string[]; createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  active:         "text-green-400 bg-green-400/10 border-green-400/20",
  pending_review: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  inactive:       "text-white/30 bg-white/[0.05] border-white/[0.08]",
};

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }

export default function SellerVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/vehicles")
      .then((r) => r.json())
      .then((d) => { if (d.success) setVehicles(d.data.items || d.data); })
      .finally(() => setLoading(false));
  }, []);

  async function toggleAvailability(id: string) {
    await fetch(`/api/seller/vehicles/${id}/availability`, { method: "PATCH" });
    const d = await fetch("/api/seller/vehicles").then((r) => r.json());
    if (d.success) setVehicles(d.data.items || d.data);
  }

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-bold text-white text-[1.5rem]">My Vehicles</h1>
          <p className="text-white/30 text-[12px] mt-0.5">{vehicles.length} vehicles</p>
        </div>
        <Link href="/seller/vehicles/new"
          className="flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-all">
          + Add vehicle
        </Link>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-white/30 text-[12px]">Loading…</p>
        ) : vehicles.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-white/30 text-[13px] mb-4">No vehicles yet</p>
            <Link href="/seller/vehicles/new"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-all">
              + Add your first vehicle
            </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Vehicle", "Price/day", "Status", "Available", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-medium text-white/30 tracking-[0.05em] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {vehicles.map((v) => (
                <tr key={v._id} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{v.emoji}</span>
                      <div>
                        <p className="text-white text-[12px] font-medium">{v.brand} {v.name}</p>
                        <p className="text-white/30 text-[10px]">{v.categories?.join(", ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white/70 text-[12px]">₹{fmt(v.pricePerDay)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 capitalize ${STATUS_STYLE[v.status] || ""}`}>
                      {v.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleAvailability(v._id)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        v.available
                          ? "text-green-400 border-green-400/20 hover:bg-green-400/[0.07]"
                          : "text-white/40 border-white/[0.08] hover:bg-white/[0.05]"
                      }`}
                    >
                      {v.available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/seller/vehicles/${v._id}/edit`}
                      className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] px-2.5 py-1 rounded-md transition-all"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
