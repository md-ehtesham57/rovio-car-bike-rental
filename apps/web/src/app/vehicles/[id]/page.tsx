"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Category = "All" | "Cars" | "Bikes" | "Luxury" | "SUV";

interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  type: string;
  emoji: string;
  pricePerDay: number;
  tag?: string;
  fuel: string;
  seats: number;
  cc?: string;
  transmission: string;
  categories: Category[];
  description: string;
  images?: string[];
  location?: string;
}

interface SimilarVehicle {
  _id: string;
  name: string;
  brand: string;
  emoji: string;
  pricePerDay: number;
  images?: string[];
}

const HIGHLIGHTS = [
  { icon: "🛡️", label: "Full insurance", desc: "Comprehensive coverage included" },
  { icon: "🧹", label: "Sanitised", desc: "Professionally cleaned before each trip" },
  { icon: "🔑", label: "Contactless", desc: "Self pick-up & return" },
  { icon: "📞", label: "24/7 support", desc: "Always reachable" },
];

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const galleryRef = useRef<HTMLDivElement>(null);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similar, setSimilar] = useState<SimilarVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setVehicle(d.data);
          fetch(`/api/vehicles?category=${d.data.categories?.find((c: string) => c !== "All") || "Cars"}&limit=5`)
            .then((r) => r.json())
            .then((s) => {
              if (s.success && s.data?.items) {
                setSimilar(s.data.items.filter((v: { _id: string }) => v._id !== d.data._id).slice(0, 4));
              }
            })
            .catch(() => {});
        } else {
          setError("Vehicle not found");
        }
      })
      .catch(() => setError("Failed to load vehicle"))
      .finally(() => setLoading(false));
  }, [id]);

  const today = new Date().toISOString().split("T")[0];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = startDate && endDate ? Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) : 0;
  const totalPrice = vehicle && days > 0 ? vehicle.pricePerDay * days : 0;

  async function handleBook() {
    if (!user) {
      router.push(`/login?redirect=/vehicles/${vehicle?._id || id}`);
      return;
    }
    if (!startDate || !endDate || days < 1) {
      setError("Please select valid dates");
      return;
    }
    if (!vehicle) return;

    setBooking(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: vehicle._id, startDate, endDate, totalPrice }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/bookings");
      } else {
        setError(data.message || "Booking failed");
      }
    } catch {
      setError("Booking failed. Please try again.");
    }
    setBooking(false);
  }

  function scrollGallery(dir: number) {
    if (!galleryRef.current) return;
    const imgs = vehicle?.images?.filter(Boolean) || [];
    const next = (imgIdx + dir + imgs.length) % imgs.length;
    setImgIdx(next);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0C0C0E] pt-[60px] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-[#E11D48] rounded-full" />
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-[#0C0C0E] pt-[60px] flex flex-col items-center justify-center gap-5">
        <div className="text-5xl opacity-40">🔍</div>
        <p className="text-white/50 text-[14px]">{error || "Vehicle not found"}</p>
        <Link href="/vehicles" className="text-[#E11D48] text-[13px] hover:underline flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Browse all vehicles
        </Link>
      </main>
    );
  }

  const images = vehicle.images?.filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-[#0C0C0E] text-white">

      {/* ─── Lightbox ──────────────────────────────────────── */}
      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
          <img src={`${API_URL}${images[imgIdx]}`} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); scrollGallery(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); scrollGallery(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* ─── Breadcrumb ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-[11px] text-white/25">
          <Link href="/" className="hover:text-white/50 transition-colors">Home</Link>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <Link href="/vehicles" className="hover:text-white/50 transition-colors">Vehicles</Link>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-white/50 truncate max-w-[160px]">{vehicle.brand} {vehicle.name}</span>
        </nav>
      </div>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ═══ LEFT: Gallery + Info ═══ */}
          <div className="lg:col-span-3 space-y-6">

            {/* Gallery */}
            <div className="relative bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-[16/9] md:aspect-[16/10] cursor-pointer" onClick={() => setLightbox(true)}>
                    <img src={`${API_URL}${images[imgIdx]}`} alt={`${vehicle.brand} ${vehicle.name}`}
                      className="w-full h-full object-cover transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-white/50 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      Click to expand
                    </div>
                  </div>
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); scrollGallery(-1); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); scrollGallery(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </>
                  )}
                  {/* Thumbnails */}
                  <div className="flex gap-2 p-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {images.map((url, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-[#E11D48] opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}>
                        <img src={`${API_URL}${url}`} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="aspect-[16/9] flex items-center justify-center bg-[#0C0C0E]">
                  <span className="text-[72px]">{vehicle.emoji}</span>
                </div>
              )}
              {vehicle.tag && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold text-white bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded tracking-[0.06em]">
                  {vehicle.tag}
                </span>
              )}
            </div>

            {/* Title + quick stats */}
            <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="text-white/30 text-[11px] tracking-[0.06em] uppercase mb-1">{vehicle.type}</p>
                  <h1 className="font-syne font-bold text-[1.8rem] md:text-[2.4rem] text-white tracking-[-0.02em] leading-[1.1]">
                    {vehicle.brand} {vehicle.name}
                  </h1>
                  {vehicle.location && (
                    <div className="flex items-center gap-1.5 text-white/35 text-[12px] mt-2">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 .5v2M6 9.5v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      {vehicle.location}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {vehicle.categories?.filter((c) => c !== "All").map((c) => (
                    <span key={c} className="text-[10px] text-white/40 bg-white/[0.05] px-2.5 py-1 rounded-[5px] capitalize">{c.toLowerCase()}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-6">
              <h3 className="text-white/50 text-[11px] tracking-[0.05em] uppercase mb-4">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Fuel", value: vehicle.fuel, icon: "⛽" },
                  { label: "Transmission", value: vehicle.transmission, icon: "⚙️" },
                  { label: "Seats", value: `${vehicle.seats} seats`, icon: "💺" },
                  { label: "Engine", value: vehicle.cc || "—", icon: "🔧" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#0C0C0E] border border-white/[0.05] rounded-lg p-4">
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-white/30 text-[10px] tracking-[0.05em] uppercase mt-2">{s.label}</p>
                    <p className="text-white text-[14px] font-medium mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-6">
              <h3 className="text-white/50 text-[11px] tracking-[0.05em] uppercase mb-3">About this vehicle</h3>
              <p className="text-white/60 text-[13px] leading-[1.9]">{vehicle.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-6">
              <h3 className="text-white/50 text-[11px] tracking-[0.05em] uppercase mb-4">What&apos;s included</h3>
              <div className="grid grid-cols-2 gap-4">
                {HIGHLIGHTS.map((h) => (
                  <div key={h.label} className="flex gap-3">
                    <span className="text-lg shrink-0">{h.icon}</span>
                    <div>
                      <p className="text-white text-[13px] font-medium">{h.label}</p>
                      <p className="text-white/35 text-[11px]">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ RIGHT: Booking card ═══ */}
          <div className="lg:col-span-2">
            <div className="sticky top-[76px] space-y-5">
              {/* Price card */}
              <div className="bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-white/[0.06]">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="font-syne font-bold text-white text-[1.8rem] leading-none">₹{vehicle.pricePerDay.toLocaleString("en-IN")}</div>
                      <div className="text-white/30 text-[12px] mt-1">per day</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/35 text-[12px]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                      <span>Instant booking</span>
                    </div>
                  </div>
                </div>

                {/* Date picker */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/40 text-[10px] font-medium mb-1.5 tracking-[0.06em] uppercase">Pick-up</label>
                      <input type="date" value={startDate} min={today} onChange={(e) => { setStartDate(e.target.value); setError(null); }}
                        className="w-full bg-[#0C0C0E] border border-white/[0.09] rounded-lg px-3 py-2.5 text-white text-[12px] outline-none focus:border-[#E11D48]/50 transition-colors [color-scheme:dark]" />
                    </div>
                    <div>
                      <label className="block text-white/40 text-[10px] font-medium mb-1.5 tracking-[0.06em] uppercase">Drop-off</label>
                      <input type="date" value={endDate} min={startDate || today} onChange={(e) => { setEndDate(e.target.value); setError(null); }}
                        className="w-full bg-[#0C0C0E] border border-white/[0.09] rounded-lg px-3 py-2.5 text-white text-[12px] outline-none focus:border-[#E11D48]/50 transition-colors [color-scheme:dark]" />
                    </div>
                  </div>

                  {/* Quick date presets */}
                  {!startDate && !endDate && (
                    <div className="flex gap-2">
                      {[
                        { label: "1 day", days: 1 },
                        { label: "3 days", days: 3 },
                        { label: "Week", days: 7 },
                      ].map((p) => (
                        <button key={p.label} type="button" onClick={() => {
                          const s = new Date(); s.setDate(s.getDate() + 1);
                          const e = new Date(s); e.setDate(e.getDate() + p.days);
                          setStartDate(s.toISOString().split("T")[0]);
                          setEndDate(e.toISOString().split("T")[0]);
                          setError(null);
                        }}
                          className="flex-1 text-center text-[11px] text-white/40 hover:text-white/60 border border-white/[0.08] hover:border-white/20 py-2 rounded-lg transition-all">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price breakdown */}
                  {days > 0 && (
                    <div className="bg-[#0C0C0E] rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-white/50">₹{vehicle.pricePerDay.toLocaleString("en-IN")} × {days} day{days > 1 ? "s" : ""}</span>
                        <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-white/50">Insurance & service</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="h-px bg-white/[0.06]" />
                      <div className="flex justify-between text-[16px] font-semibold">
                        <span className="text-white">Total</span>
                        <span className="font-syne">₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.07] border border-[#E11D48]/20 rounded-lg px-3.5 py-2.5 leading-relaxed">{error}</div>
                  )}

                  <button onClick={handleBook} disabled={booking}
                    className="w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 text-white text-[13px] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    {booking ? (
                      <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Booking...</>
                    ) : user ? (
                      <>Book now <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                    ) : (
                      <>Sign in to book</>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-white/20 text-[11px]">
                    <span className="flex items-center gap-1">✓ Free cancellation</span>
                    <span className="flex items-center gap-1">✓ Insured</span>
                  </div>
                </div>
              </div>

              {/* Seller info */}
              <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E11D48]/15 flex items-center justify-center shrink-0">
                    <span className="font-syne font-bold text-[#E11D48] text-[14px]">R</span>
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-medium">Rovio Rentals</p>
                    <p className="text-white/30 text-[11px]">Verified fleet partner</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-white/30 text-[11px]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L9 5h4l-3 2.5L11.5 12 7 9 2.5 12 4 7.5 1 5h4l2-4z" fill="currentColor"/></svg>
                    4.9
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Similar vehicles ────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="border-t border-white/[0.06] py-12 md:py-16 px-5 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-2">Similar</p>
                <h2 className="font-syne font-semibold text-[1.4rem] md:text-[1.8rem] text-white tracking-[-0.02em]">You might also like</h2>
              </div>
              <Link href="/vehicles" className="text-[12px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
                View all <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similar.map((v) => (
                <Link key={v._id} href={`/vehicles/${v._id}`}
                  className="group bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200">
                  <div className="h-[100px] bg-[#0C0C0E] flex items-center justify-center overflow-hidden">
                    {v.images?.length ? (
                      <img src={`${API_URL}${v.images[0]}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-3xl">{v.emoji}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-[12px] font-medium truncate">{v.brand} {v.name}</p>
                    <div className="font-syne font-semibold text-white text-[14px] mt-1">₹{v.pricePerDay.toLocaleString("en-IN")}<span className="font-normal text-white/30 text-[10px]">/day</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06] py-12 md:py-16 px-5 md:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#141416] to-[#0C0C0E] border border-white/[0.07] rounded-2xl p-8 md:p-12">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="font-syne font-semibold text-[1.4rem] md:text-[1.8rem] text-white tracking-[-0.02em] mb-2">Own a vehicle? List it on Rovio</h2>
            <p className="text-white/40 text-[13px] max-w-md mx-auto mb-6">Earn extra income by renting out your car or bike. We handle the bookings, insurance, and support.</p>
            <Link href={user ? "/seller/vehicles/new" : "/register?redirect=/seller/vehicles/new"}
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-6 py-3 rounded-lg transition-colors">
              Start earning
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
