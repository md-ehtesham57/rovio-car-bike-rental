"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface BookingVehicle {
  _id: string;
  name: string;
  brand: string;
  emoji: string;
  images?: string[];
}

interface Booking {
  _id: string;
  vehicleId: BookingVehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  createdAt: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed:  "text-blue-400 bg-blue-400/10 border-blue-400/20",
  active:     "text-green-400 bg-green-400/10 border-green-400/20",
  completed:  "text-white/40 bg-white/[0.05] border-white/[0.08]",
  cancelled:  "text-red-400/50 bg-red-400/[0.06] border-red-400/15",
};

function fmt(n: number) { return new Intl.NumberFormat("en-IN").format(n); }
function dateStr(d: string) { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push("/login?redirect=/bookings"); return; }
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.data || []); })
      .finally(() => setLoading(false));
  }, [user, router]);

  async function handleCancel(id: string) {
    setCancelling(id);
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
    const d = await res.json();
    if (d.success) {
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
    }
    setCancelling(null);
  }

  return (
    <main className="min-h-screen bg-[#0C0C0E] text-white pt-[60px]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-syne font-bold text-[1.6rem]">My Bookings</h1>
            <p className="text-white/35 text-[13px] mt-1">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link href="/vehicles"
            className="flex items-center gap-1.5 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-colors">
            + Book a vehicle
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-[#E11D48] rounded-full" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-12 text-center">
            <div className="text-4xl mb-4 opacity-40">📋</div>
            <p className="text-white/40 text-[14px] mb-4">No bookings yet</p>
            <Link href="/vehicles"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[12px] font-medium px-5 py-2.5 rounded-lg transition-colors">
              Browse vehicles
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const v = b.vehicleId;
              const canCancel = ["pending", "confirmed"].includes(b.status);

              return (
                <div key={b._id}
                  className="bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumb */}
                    <div className="w-full sm:w-[140px] h-[100px] sm:h-auto bg-[#0C0C0E] flex items-center justify-center shrink-0">
                      {v?.images?.length ? (
                        <img src={`${API_URL}${v.images[0]}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{v?.emoji || "🚗"}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                      <div className="flex-1 min-w-0">
                        <p className="text-white/30 text-[10px] tracking-[0.06em] uppercase">
                          {b._id.slice(-6)}
                        </p>
                        <h3 className="font-syne font-semibold text-white text-[15px] truncate">
                          {v?.brand} {v?.name}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-white/40 text-[12px]">
                          <span>{dateStr(b.startDate)} → {dateStr(b.endDate)}</span>
                          <span className="font-syne font-medium text-white/70">₹{fmt(b.totalPrice)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-medium border rounded-full px-2.5 py-0.5 capitalize ${STATUS_STYLE[b.status] || ""}`}>
                          {b.status}
                        </span>
                        {canCancel && (
                          <button onClick={() => handleCancel(b._id)} disabled={cancelling === b._id}
                            className="text-[11px] text-red-400/60 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-md transition-all disabled:opacity-40">
                            {cancelling === b._id ? "..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
