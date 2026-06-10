"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Category = "All" | "Cars" | "Bikes" | "Luxury" | "SUV";

interface Vehicle {
  id: number;
  _id?: string;
  name: string;
  brand: string;
  type: string;
  emoji: string;
  price: number;
  tag?: string;
  fuel: string;
  seats: number;
  cc?: string;
  transmission: string;
  categories: Category[];
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: 1,  name: "Roma",          brand: "Ferrari",       type: "Sports Car",    emoji: "🏎️", price: 12000, tag: "Hot",         fuel: "Petrol", seats: 2, transmission: "Auto",   categories: ["All","Cars","Luxury"] },
  { id: 2,  name: "5 Series",      brand: "BMW",           type: "Sedan",         emoji: "🚗", price: 8000,  tag: "Luxury",      fuel: "Diesel", seats: 5, transmission: "Auto",   categories: ["All","Cars","Luxury"] },
  { id: 3,  name: "E-Class",       brand: "Mercedes-Benz", type: "Luxury Sedan",  emoji: "🚗", price: 9500,  tag: "Luxury",      fuel: "Diesel", seats: 5, transmission: "Auto",   categories: ["All","Cars","Luxury"] },
  { id: 4,  name: "Continental",   brand: "Bentley",       type: "Grand Tourer",  emoji: "🏎️", price: 18000, tag: "Elite",       fuel: "Petrol", seats: 4, transmission: "Auto",   categories: ["All","Cars","Luxury"] },
  { id: 5,  name: "CX-5",         brand: "Mazda",         type: "SUV",           emoji: "🚙", price: 5000,  tag: "Popular",     fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars","SUV"]    },
  { id: 6,  name: "Thar",         brand: "Mahindra",      type: "Off-Road SUV",  emoji: "🚙", price: 4500,                      fuel: "Diesel", seats: 4, transmission: "Manual", categories: ["All","Cars","SUV"]    },
  { id: 7,  name: "Scorpio N",    brand: "Mahindra",      type: "SUV",           emoji: "🚙", price: 4000,                      fuel: "Diesel", seats: 7, transmission: "Manual", categories: ["All","Cars","SUV"]    },
  { id: 8,  name: "City",         brand: "Honda",         type: "Sedan",         emoji: "🚗", price: 2800,  tag: "Value",       fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars"]          },
  { id: 9,  name: "Hector",       brand: "MG",            type: "SUV",           emoji: "🚙", price: 3800,                      fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars","SUV"]    },
  { id: 10, name: "Bolero",       brand: "Mahindra",      type: "Utility SUV",   emoji: "🚙", price: 3200,                      fuel: "Diesel", seats: 7, transmission: "Manual", categories: ["All","Cars","SUV"]    },
  { id: 11, name: "Bullet 350",   brand: "Royal Enfield", type: "Cruiser",       emoji: "🏍️", price: 1500,  tag: "Iconic",      fuel: "Petrol", seats: 2, cc: "350cc", transmission: "Manual", categories: ["All","Bikes"] },
  { id: 12, name: "Activa 6G",    brand: "Honda",         type: "Scooter",       emoji: "🛵", price: 600,   tag: "Best Seller", fuel: "Petrol", seats: 2, cc: "110cc", transmission: "Auto",   categories: ["All","Bikes"] },
  { id: 13, name: "Splendor+",    brand: "Hero",          type: "Commuter",      emoji: "🏍️", price: 500,                       fuel: "Petrol", seats: 2, cc: "100cc", transmission: "Manual", categories: ["All","Bikes"] },
];

const BRANDS = [
  "Honda","BMW","Ferrari","Mahindra","Suzuki","Yamaha",
  "Bentley","Ford","Mazda","Tata","Tesla","Vespa","MG","Volvo","Royal Enfield","Mercedes-Benz",
];

const TESTIMONIALS = [
  { quote: "Zero paperwork, zero stress. The BMW was immaculate. Rovio has completely changed how I think about rentals.", name: "Arjun Rawat",  city: "Mumbai",    vehicle: "BMW 5 Series",         initials: "AR" },
  { quote: "Rented the Thar for Coorg with friends. Beast of a machine. Delivery on time, pickup smooth. Will be back.", name: "Priya Sharma", city: "Bangalore", vehicle: "Mahindra Thar",        initials: "PS" },
  { quote: "The BMW 5 Series for our anniversary dinner — jaws dropped. Rovio's fleet is unreal. Booked in 90 seconds.", name: "Karan Mehta",  city: "Delhi",     vehicle: "BMW 5 Series",         initials: "KM" },
  { quote: "Finally a rental platform that doesn't feel like a government office. Rode the Bullet all the way to Manali.", name: "Sneha Iyer",   city: "Chennai",   vehicle: "Royal Enfield Bullet", initials: "SI" },
];

const WHY = [
  { icon: "⚡", title: "Instant booking",  body: "Confirmed in under 2 minutes. No queues, no paperwork, no phone calls." },
  { icon: "🛡️", title: "Fully insured",    body: "Comprehensive cover on every vehicle, every single rental." },
  { icon: "✓",  title: "Verified fleet",   body: "Inspected and serviced before every booking. Always road-ready." },
  { icon: "📞", title: "24/7 support",     body: "Always reachable. Breakdown or question — we're here." },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [["Home", "/"], ["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"]] as const;

  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" :
    user?.role === "seller" ? "/seller/dashboard" : "/profile";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0C0C0E]/90 backdrop-blur-xl border-b border-white/[0.06]" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[26px] h-[26px] rounded-[5px] bg-[#E11D48] flex items-center justify-center">
            <span className="font-syne font-bold text-white text-[9px] tracking-tight">RV</span>
          </div>
          <span className="font-syne font-semibold text-white text-[15px] tracking-[0.02em]">Rovio</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="px-3.5 py-2 text-[13px] text-white/40 hover:text-white/80 rounded-md hover:bg-white/[0.04] transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/login?redirect=/seller/dashboard" className="text-[13px] text-white/40 hover:text-white/70 transition-all duration-150">
                List a vehicle
              </Link>
              <Link
                href={dashboardHref}
                className="text-[13px] text-white/50 hover:text-white/80 border border-white/20 hover:border-white/40 px-4 py-2 rounded-md transition-all duration-150"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-150"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login?redirect=/seller/dashboard" className="text-[13px] text-white/40 hover:text-white/70 transition-all duration-150">
                List a vehicle
              </Link>
              <Link href="/login" className="text-[13px] text-white/50 hover:text-white/80 border border-white/20 hover:border-white/40 px-4 py-2 rounded-md transition-all duration-150">
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-150"
              >
                Get started
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-[5px] p-1"
        >
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-250 overflow-hidden ${open ? "max-h-72" : "max-h-0"}`}>
        <div className="bg-[#0C0C0E]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 flex flex-col gap-px">
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors last:border-b-0"
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setOpen(false)}
                className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="mt-3 flex justify-center bg-white/[0.06] text-white/70 hover:text-white text-[13px] font-medium py-2.5 rounded-md w-full"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="mt-3 flex justify-center bg-[#E11D48] text-white text-[13px] font-medium py-2.5 rounded-md"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const words = ["road.", "city.", "hills.", "journey."];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const len = words.length;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % len);
        setVisible(true);
      }, 250);
    }, 2400);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    { n: "50+",  l: "Vehicles" },
    { n: "12k+", l: "Renters" },
    { n: "4.9★", l: "Rating" },
    { n: "24/7", l: "Support" },
  ];



  return (
    <section className="relative flex items-center overflow-hidden bg-[#0C0C0E] pt-[60px]">
      {/* Glows */}
      <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#E11D48]/[0.055] blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[5%] w-[300px] h-[300px] rounded-full bg-[#E11D48]/[0.03] blur-[90px] pointer-events-none" />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-20 w-full">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 border border-white/[0.1] rounded-full px-4 py-1.5 mb-5 md:mb-8">
              <span className="w-[5px] h-[5px] rounded-full bg-[#E11D48] animate-pulse" />
              <span className="text-[11px] text-white/40 tracking-[0.06em]">Available across India</span>
            </div>

            {/* Headline */}
            <h1 className="font-syne font-semibold text-[clamp(2.2rem,5vw,4.8rem)] leading-[1.06] tracking-[-0.03em] text-white mb-4 md:mb-5">
              Find your ride,<br />
              own the{" "}
              <em
                className="not-italic text-[#E11D48] transition-opacity duration-200"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {words[idx]}
              </em>
            </h1>

            {/* Sub */}
            <p className="text-white/40 text-[14px] md:text-[15px] leading-[1.75] max-w-[400px] font-light mb-6 md:mb-8">
              Rent premium cars and bikes in minutes. No paperwork, no hassle — just you and the open road.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8 md:mb-12">
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-6 py-3 rounded-md transition-all duration-150 hover:-translate-y-px"
              >
                Browse vehicles
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center text-white/40 hover:text-white/70 text-[13px] px-6 py-3 rounded-md border border-white/[0.09] hover:border-white/[0.18] transition-all duration-150"
              >
                How it works
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 border border-white/[0.07] rounded-xl overflow-hidden">
              {stats.map(({ n, l }, i) => (
                <div
                  key={l}
                  className={`px-4 py-4 bg-[#0C0C0E] hover:bg-white/[0.02] transition-colors group ${i < 3 ? "border-r border-white/[0.07]" : ""}`}
                >
                  <div className="font-syne font-semibold text-[1.4rem] text-white group-hover:text-[#E11D48] transition-colors duration-200">{n}</div>
                  <div className="text-white/30 text-[10px] tracking-[0.04em] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — vehicle cards ── */}
          <div className="hidden lg:flex flex-col gap-3">
            {/* Featured large card */}
            <div className="bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-[#E11D48]/30 transition-all duration-200 group">
              <div className="h-[140px] flex items-center justify-center relative"
                style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(225,29,72,0.1) 0%, #141416 65%)" }}>
                <span className="text-[64px] group-hover:scale-105 transition-transform duration-300 select-none">🏎️</span>
                <span className="absolute top-3 right-3 text-[9px] font-semibold text-white/60 bg-white/[0.07] px-2 py-0.5 rounded tracking-[0.06em]">Hot</span>
              </div>
              <div className="px-4 py-3.5 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-white/30 text-[10px] mb-0.5">Sports Car</p>
                  <p className="font-syne font-semibold text-white text-[14px]">Ferrari <span className="font-normal text-white/50">Roma</span></p>
                </div>
                <div className="text-right">
                  <p className="font-syne font-semibold text-white text-[16px]">₹12,000</p>
                  <p className="text-white/25 text-[9px]">/day</p>
                </div>
              </div>
            </div>

            {/* Two smaller cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { brand: "BMW", name: "5 Series", type: "Sedan",   price: 8000,  emoji: "🚗", tag: "Luxury", glow: "rgba(29,78,216,0.08)" },
                { brand: "RE",  name: "Bullet",   type: "Cruiser", price: 1500,  emoji: "🏍️", tag: "Iconic", glow: "rgba(120,53,15,0.1)"  },
              ].map((c) => (
                <div key={c.name} className="bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.14] transition-all duration-200 group">
                  <div className="h-[90px] flex items-center justify-center relative"
                    style={{ background: `radial-gradient(ellipse at center, ${c.glow} 0%, #141416 70%)` }}>
                    <span className="text-[40px] group-hover:scale-105 transition-transform duration-300 select-none">{c.emoji}</span>
                    <span className="absolute top-2 right-2 text-[8px] font-semibold text-white/50 bg-white/[0.06] px-1.5 py-0.5 rounded tracking-[0.06em]">{c.tag}</span>
                  </div>
                  <div className="px-3 py-2.5 border-t border-white/[0.06]">
                    <p className="text-white/25 text-[9px] mb-0.5">{c.type}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-syne font-semibold text-white text-[12px]">{c.brand} <span className="font-normal text-white/45">{c.name}</span></p>
                      <p className="font-syne font-semibold text-white text-[13px]">₹{c.price.toLocaleString("en-IN")}<span className="text-white/25 text-[8px] font-normal">/d</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle "see all" hint */}
            <Link href="/vehicles" className="flex items-center justify-center gap-1.5 py-3 text-white/25 hover:text-white/50 text-[11px] border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all duration-150">
              View all 13 vehicles
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-25">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white animate-[scrollLine_1.6s_ease-in-out_infinite]" />
        <span className="text-white text-[9px] tracking-[0.28em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <div className="bg-[#0C0C0E] border-y border-white/[0.06] py-3.5 overflow-hidden">
      <div className="flex animate-ticker w-max">
        {doubled.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 text-[11px] font-medium text-white/[0.18] tracking-[0.12em] uppercase whitespace-nowrap"
          >
            <span className="w-[3px] h-[3px] rounded-full bg-[#E11D48] shrink-0" />
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

function mapApiVehicle(v: any): Vehicle {
  return {
    id: v._id ? parseInt(v._id.toString().slice(-6), 16) : 0,
    _id: v._id?.toString(),
    name: v.name,
    brand: v.brand,
    type: v.type,
    emoji: v.emoji,
    price: v.pricePerDay,
    tag: v.tag,
    fuel: v.fuel,
    seats: v.seats,
    cc: v.cc,
    transmission: v.transmission,
    categories: ["All", ...(v.categories || [])] as Category[],
  };
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [active, setActive] = useState<Category>("All");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.items)) {
          const api = json.data.items.map(mapApiVehicle);
          setVehicles((prev) => [...api, ...prev]);
        }
      } catch {
        /* fallback to mock */
      }
    };
    fetchVehicles();
  }, []);

  const categories: Category[] = ["All", "Cars", "Bikes", "Luxury", "SUV"];
  const filtered = vehicles.filter((v) => v.categories.includes(active));

  return (
    <section className="bg-[#0C0C0E] py-14 md:py-24 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Fleet</p>
            <h2 className="font-syne font-semibold text-[1.9rem] md:text-[3rem] text-white tracking-[-0.03em] leading-[1.05]">
            </h2>
          </div>
          <p className="text-white/30 text-[13px] leading-[1.7] max-w-[260px] md:text-right">
            Hand-picked, serviced and insured. Every vehicle ready for the road.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0 mb-9 border-b border-white/[0.07] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3.5 md:px-5 py-3 text-[12px] font-medium tracking-[0.04em] transition-all duration-150 border-b-[1.5px] -mb-px whitespace-nowrap ${
                active === cat
                  ? "text-white border-[#E11D48]"
                  : "text-white/30 border-transparent hover:text-white/55"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>

        {/* View all */}
        <div className="flex justify-center mt-10">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-[12px] tracking-[0.04em] border border-white/[0.09] hover:border-white/[0.18] px-7 py-3 rounded-md transition-all duration-150"
          >
            View all vehicles
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  return (
    <div className="group bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200">
      {/* Top image area */}
      <div className="h-[110px] flex flex-col justify-between p-3 relative">
        {/* Subtle tinted bg per category */}
        <div className="absolute inset-0 bg-[#0C0C0E]" />
        <div className="absolute inset-0 opacity-40" style={{
          background: `radial-gradient(ellipse at 70% 40%, ${
            v.categories.includes("Luxury") ? "rgba(120,80,200,0.15)" :
            v.categories.includes("Bikes") ? "rgba(234,88,12,0.12)" :
            v.categories.includes("SUV") ? "rgba(21,128,61,0.1)" :
            "rgba(225,29,72,0.08)"
          } 0%, transparent 70%)`
        }} />

        {/* Tag */}
        {v.tag && (
          <span className="relative self-end text-[9px] font-semibold text-white/70 bg-white/[0.08] px-2 py-0.5 rounded tracking-[0.06em]">
            {v.tag}
          </span>
        )}
        {!v.tag && <span />}

        {/* Emoji */}
        <div className="relative flex items-center justify-center text-[42px] leading-none select-none group-hover:scale-105 transition-transform duration-300">
          {v.emoji}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 border-t border-white/[0.06]">
        <p className="text-white/30 text-[10px] tracking-[0.06em] mb-0.5">{v.type}</p>
        <div className="flex items-start justify-between gap-1 mb-3">
          <h3 className="font-syne font-semibold text-white text-[14px] leading-tight">
            {v.brand} <span className="font-normal text-white/50">{v.name}</span>
          </h3>
          <div className="text-right shrink-0">
            <div className="font-syne font-semibold text-white text-[15px]">
              ₹{v.price.toLocaleString("en-IN")}
            </div>
            <div className="text-white/25 text-[9px]">/day</div>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {[v.fuel, `${v.seats} seats`, v.cc ?? v.transmission].map((s) => (
            <span key={s} className="text-[10px] text-white/35 bg-white/[0.05] px-2 py-0.5 rounded-[4px]">
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Link
            href={`/vehicles/${v.id}`}
            className="flex-1 text-center text-[11px] text-white/35 hover:text-white/65 border border-white/[0.08] hover:border-white/[0.16] py-2.5 rounded-md transition-all duration-150"
          >
            Details
          </Link>
          <Link
            href={`/vehicles/${v.id}`}
            className="flex-1 text-center text-[11px] text-white font-medium bg-[#E11D48] hover:bg-[#F43F5E] py-2.5 rounded-md transition-colors duration-150"
          >
            Book now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Why section ──────────────────────────────────────────────────────────────

function Why() {
  return (
    <section className="bg-[#0A0A0C] border-y border-white/[0.06] py-14 md:py-24 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12">
          <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Why Rovio</p>
          <h2 className="font-syne font-semibold text-[1.9rem] md:text-[3rem] text-white tracking-[-0.03em] leading-[1.05]">
            The smarter way<br />to rent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WHY.map((f, i) => (
            <div
              key={f.title}
              className="bg-[#0C0C0E] border border-white/[0.07] rounded-xl p-6 hover:border-white/[0.13] transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E11D48]/[0.1] flex items-center justify-center text-base mb-5 group-hover:bg-[#E11D48]/[0.18] transition-colors duration-200">
                {f.icon}
              </div>
              <h3 className="font-syne font-semibold text-white text-[14px] mb-2">{f.title}</h3>
              <p className="text-white/35 text-[12px] leading-[1.65]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((c, i) =>
            setTimeout(() => {
              c.style.opacity = "1";
              c.style.transform = "translateY(0)";
            }, i * 90)
          );
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0C0C0E] py-14 md:py-24 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Reviews</p>
            <h2 className="font-syne font-semibold text-[1.9rem] md:text-[3rem] text-white tracking-[-0.03em] leading-[1.05]">
              What renters say
            </h2>
          </div>
          <p className="text-white/30 text-[13px] leading-[1.7] max-w-[220px] md:text-right">
            Verified reviews from real customers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              data-card
              className="bg-[#141416] border border-white/[0.07] rounded-xl p-6 transition-all duration-500 ease-out"
              style={{ opacity: 0, transform: "translateY(20px)" }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill="#E11D48">
                    <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5 3 10l.6-3.2L1.2 4.5l3.3-.5z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-white/60 text-[13px] leading-[1.7] mb-5 border-l-[1.5px] border-[#E11D48]/40 pl-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="h-px bg-white/[0.06] mb-4" />

              {/* Person */}
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-[#E11D48]/15 border border-[#E11D48]/25 flex items-center justify-center shrink-0">
                  <span className="font-syne font-semibold text-[#E11D48] text-[10px]">{t.initials}</span>
                </div>
                <div>
                  <div className="text-white text-[13px] font-medium">{t.name}</div>
                  <div className="text-white/30 text-[11px] mt-0.5">
                    {t.city} &middot; {t.vehicle}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[#34D399] text-[10px] font-medium">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.1 3.7L4.4 6.4 2.9 4.9a.4.4 0 10-.6.6l1.8 1.8a.4.4 0 00.6 0l2.9-2.9a.4.4 0 00-.5-.7z"/>
                  </svg>
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="bg-[#0C0C0E] px-5 md:px-10 pb-14 md:pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-[#141416] border border-white/[0.07] rounded-xl px-6 md:px-14 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#E11D48]/[0.05] blur-[80px] pointer-events-none translate-x-1/4 -translate-y-1/4" />

          <div className="relative">
            <h2 className="font-syne font-semibold text-[1.7rem] md:text-[2.4rem] text-white tracking-[-0.03em] leading-[1.1] mb-2">
              Ready to hit the road?
            </h2>
            <p className="text-white/35 text-[13px] leading-[1.6]">
              Hundreds of vehicles waiting. Book yours in under 2 minutes.<br />No deposits. No hidden fees.
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2.5 shrink-0">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-7 py-3.5 rounded-md transition-all duration-150 hover:-translate-y-px"
            >
              Browse fleet
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center text-white/40 hover:text-white/70 text-[13px] px-7 py-3.5 rounded-md border border-white/[0.09] hover:border-white/[0.18] transition-all duration-150"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0C0C0E] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-[22px] h-[22px] rounded-[4px] bg-[#E11D48] flex items-center justify-center">
            <span className="font-syne font-bold text-white text-[8px]">RV</span>
          </div>
          <span className="font-syne font-semibold text-white/70 text-[14px] tracking-[0.02em]">Rovio Rentals</span>
        </div>

        <div className="flex flex-wrap gap-5">
          {[["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"]].map(([l, h]) => (
            <Link key={l} href={h} className="text-white/25 hover:text-white/55 text-[12px] transition-colors duration-150">
              {l}
            </Link>
          ))}
          <Link href="/admin/login" className="text-white/15 hover:text-white/35 text-[12px] transition-colors duration-150">
            Admin
          </Link>
        </div>

        <p className="text-white/15 text-[12px]">© {new Date().getFullYear()} Rovio Rentals</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-[#0C0C0E] text-white">
      <Navbar />
      <Hero />
      <Ticker />
      <Vehicles />
      <Why />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}