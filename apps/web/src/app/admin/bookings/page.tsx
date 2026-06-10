"use client";

import { useEffect, useState, useCallback } from "react";

type Booking = {
  _id: string; status: string; totalPrice: number; totalDays: number; createdAt: string;
  startDate: string; endDate: string;
  userId:    { name: string; email: string } | null;
  vehicleId: { name: string; brand: string; emoji: string } | null;
};

const STATUS_STYLE: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  active:    "text-green-400 bg-green-400/10 border-green-400/20",
  completed: "text-white/40 bg-white/[0.05] border-white/[0.08]",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  pending:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

const STATUS_OPTS = ["all", "pending", "confirmed", "active", "completed", "cancelled"];

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }); }

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [status,   setStatus]   = useState("all");
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), limit: "20" });
    if (status !== "all") q.set("status", status);
    fetch(`/api/admin/bookings?${q}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) { setBookings(d.data.items); setTotal(d.data.total); } })
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    setBusy(id);
    await fetch(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(null);
    load();
  }

  const NEXT_STATUS: Record<string, string | null> = {
    confirmed: "active",
    active:    "completed",
    pending:   "confirmed",
  };

  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Bookings</h1>
        <p className="text-white/30 text-[12px] mt-0.5">{total} total bookings</p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_OPTS.map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium capitalize transition-all border ${
              status === s ? "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/25" : "border-white/[0.07] text-white/40 hover:text-white/60"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? <p className="p-6 text-white/30 text-[12px]">Loading…</p>
        : bookings.length === 0 ? <p className="p-6 text-white/30 text-[12px]">No bookings found.</p>
        : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Vehicle", "Customer", "Dates", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-medium text-white/30 tracking-[0.05em] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{b.vehicleId?.emoji || "🚗"}</span>
                      <span className="text-white/70 text-[12px]">
                        {b.vehicleId ? `${b.vehicleId.brand} ${b.vehicleId.name}` : "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white/70 text-[12px]">{b.userId?.name || "—"}</p>
                    <p className="text-white/25 text-[10px]">{b.userId?.email || ""}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/50 text-[11px]">
                    {fmtDate(b.startDate)} – {fmtDate(b.endDate)}
                    <span className="block text-white/25 text-[10px]">{b.totalDays}d</span>
                  </td>
                  <td className="px-4 py-3.5 text-white/70 text-[12px] font-medium">₹{fmt(b.totalPrice)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 capitalize ${STATUS_STYLE[b.status] || ""}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {NEXT_STATUS[b.status] && (
                        <button
                          onClick={() => updateStatus(b._id, NEXT_STATUS[b.status]!)}
                          disabled={busy === b._id}
                          className="text-[11px] text-white/50 hover:text-white/80 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all capitalize disabled:opacity-30"
                        >
                          Mark {NEXT_STATUS[b.status]}
                        </button>
                      )}
                      {b.status !== "cancelled" && b.status !== "completed" && (
                        <button
                          onClick={() => updateStatus(b._id, "cancelled")}
                          disabled={busy === b._id}
                          className="text-[11px] text-[#E11D48]/60 hover:text-[#E11D48] border border-[#E11D48]/15 hover:bg-[#E11D48]/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-[11px]">Page {page} of {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">← Prev</button>
            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
