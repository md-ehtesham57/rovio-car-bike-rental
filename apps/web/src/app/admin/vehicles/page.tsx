"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Vehicle = {
  _id: string; name: string; brand: string; emoji: string;
  pricePerDay: number; status: string; available: boolean;
  categories: string[]; createdAt: string;
  sellerId: { name: string; email: string } | null;
};

const STATUS_OPTS = ["all", "active", "pending_review", "inactive"];

const STATUS_STYLE: Record<string, string> = {
  active:         "text-green-400 bg-green-400/10 border-green-400/20",
  pending_review: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  inactive:       "text-white/30 bg-white/[0.05] border-white/[0.08]",
};

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }

function AdminVehiclesInner() {
  const params   = useSearchParams();
  const initStatus = params.get("status") || "all";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [status,   setStatus]   = useState(initStatus);
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), limit: "20" });
    if (status !== "all") q.set("status", status);
    fetch(`/api/admin/vehicles?${q}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) { setVehicles(d.data.items); setTotal(d.data.total); } })
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    setBusy(id);
    await fetch(`/api/admin/vehicles/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(null);
    load();
  }

  async function deleteVehicle(id: string) {
    if (!confirm("Delete this vehicle? This cannot be undone.")) return;
    setBusy(id);
    await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
    setBusy(null);
    load();
  }

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-bold text-white text-[1.5rem]">Vehicles</h1>
          <p className="text-white/30 text-[12px] mt-0.5">{total} total vehicles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {STATUS_OPTS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium capitalize transition-all border ${
              status === s
                ? "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/25"
                : "border-white/[0.07] text-white/40 hover:text-white/60"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141416] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-white/30 text-[12px]">Loading…</p>
        ) : vehicles.length === 0 ? (
          <p className="p-6 text-white/30 text-[12px]">No vehicles found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Vehicle", "Seller", "Price/day", "Categories", "Status", ""].map((h) => (
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
                        <p className="text-white/30 text-[10px]">{v._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white/60 text-[11px]">{v.sellerId?.name || "—"}</p>
                    <p className="text-white/25 text-[10px]">{v.sellerId?.email || ""}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/70 text-[12px]">₹{fmt(v.pricePerDay)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {v.categories.map((c) => (
                        <span key={c} className="text-[10px] text-white/40 bg-white/[0.05] rounded px-1.5 py-0.5">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 capitalize ${STATUS_STYLE[v.status] || ""}`}>
                      {v.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {v.status === "pending_review" && (
                        <>
                          <button
                            onClick={() => updateStatus(v._id, "active")}
                            disabled={busy === v._id}
                            className="text-[11px] text-green-400 hover:text-green-300 border border-green-400/20 hover:bg-green-400/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(v._id, "inactive")}
                            disabled={busy === v._id}
                            className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-40"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {v.status === "active" && (
                        <button
                          onClick={() => updateStatus(v._id, "inactive")}
                          disabled={busy === v._id}
                          className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-40"
                        >
                          Deactivate
                        </button>
                      )}
                      {v.status === "inactive" && (
                        <button
                          onClick={() => updateStatus(v._id, "active")}
                          disabled={busy === v._id}
                          className="text-[11px] text-green-400 hover:text-green-300 border border-green-400/20 px-2.5 py-1 rounded-md transition-all disabled:opacity-40"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => deleteVehicle(v._id)}
                        disabled={busy === v._id}
                        className="text-[11px] text-[#E11D48]/60 hover:text-[#E11D48] border border-[#E11D48]/15 hover:bg-[#E11D48]/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-[11px]">Page {page} of {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">
              ← Prev
            </button>
            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVehiclesPage() {
  return (
    <Suspense fallback={<div className="p-7 text-white/30 text-[12px]">Loading…</div>}>
      <AdminVehiclesInner />
    </Suspense>
  );
}
