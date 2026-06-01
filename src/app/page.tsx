"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Category = "ALL" | "CARS" | "BIKES" | "LUXURY" | "SUV";

interface Vehicle {
  id: number;
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
  accentColor: string;
}

const VEHICLES: Vehicle[] = [
  { id: 1,  name: "Roma",         brand: "Ferrari",        type: "Sports Car",    emoji: "🔴", price: 12000, tag: "HOT",     fuel: "Petrol",  seats: 2, transmission: "Auto",   categories: ["ALL","CARS","LUXURY"], accentColor: "#DC2626" },
  { id: 2,  name: "5 Series",     brand: "BMW",            type: "Sedan",         emoji: "⚫", price: 8000,  tag: "LUXURY",  fuel: "Diesel",  seats: 5, transmission: "Auto",   categories: ["ALL","CARS","LUXURY"], accentColor: "#1D4ED8" },
  { id: 3,  name: "E-Class",      brand: "Mercedes-Benz",  type: "Luxury Sedan",  emoji: "⚪", price: 9500,  tag: "LUXURY",  fuel: "Diesel",  seats: 5, transmission: "Auto",   categories: ["ALL","CARS","LUXURY"], accentColor: "#374151" },
  { id: 4,  name: "Continental",  brand: "Bentley",        type: "Grand Tourer",  emoji: "🟤", price: 18000, tag: "ELITE",   fuel: "Petrol",  seats: 4, transmission: "Auto",   categories: ["ALL","CARS","LUXURY"], accentColor: "#92400E" },
  { id: 5,  name: "CX-5",        brand: "Mazda",          type: "SUV",           emoji: "🔵", price: 5000,  tag: "POPULAR", fuel: "Petrol",  seats: 5, transmission: "Auto",   categories: ["ALL","CARS","SUV"],    accentColor: "#1E3A8A" },
  { id: 6,  name: "Thar",        brand: "Mahindra",       type: "Off-Road SUV",  emoji: "🟢", price: 4500,               fuel: "Diesel",  seats: 4, transmission: "Manual", categories: ["ALL","CARS","SUV"],    accentColor: "#14532D" },
  { id: 7,  name: "Scorpio N",   brand: "Mahindra",       type: "SUV",           emoji: "🟠", price: 4000,               fuel: "Diesel",  seats: 7, transmission: "Manual", categories: ["ALL","CARS","SUV"],    accentColor: "#7C2D12" },
  { id: 8,  name: "City",        brand: "Honda",          type: "Sedan",         emoji: "🔵", price: 2800,  tag: "VALUE",   fuel: "Petrol",  seats: 5, transmission: "Auto",   categories: ["ALL","CARS"],          accentColor: "#1E40AF" },
  { id: 9,  name: "Hector",      brand: "MG",             type: "SUV",           emoji: "⚫", price: 3800,               fuel: "Petrol",  seats: 5, transmission: "Auto",   categories: ["ALL","CARS","SUV"],    accentColor: "#1F2937" },
  { id: 10, name: "Bolero",      brand: "Mahindra",       type: "Utility SUV",   emoji: "🟤", price: 3200,               fuel: "Diesel",  seats: 7, transmission: "Manual", categories: ["ALL","CARS","SUV"],    accentColor: "#451A03" },
  { id: 11, name: "Bullet 350",  brand: "Royal Enfield",  type: "Cruiser",       emoji: "⚫", price: 1500,  tag: "ICONIC",  fuel: "Petrol",  seats: 2, cc: "350cc", transmission: "Manual", categories: ["ALL","BIKES"],         accentColor: "#1C1917" },
  { id: 12, name: "Activa 6G",   brand: "Honda",          type: "Scooter",       emoji: "🔴", price: 600,   tag: "BEST SELLER", fuel: "Petrol", seats: 2, cc: "110cc", transmission: "Auto", categories: ["ALL","BIKES"],         accentColor: "#991B1B" },
  { id: 13, name: "Splendor+",   brand: "Hero",           type: "Commuter Bike", emoji: "🔵", price: 500,               fuel: "Petrol",  seats: 2, cc: "100cc", transmission: "Manual", categories: ["ALL","BIKES"],         accentColor: "#1E3A8A" },
];

const BRANDS = ["Honda","BMW","Ferrari","Mahindra","Suzuki","Yamaha","Bentley","Ford","Mazda","Tata","Tesla","Vespa","MG","Volvo","Royal Enfield","Mercedes-Benz"];

const TESTIMONIALS = [
  { quote: "Took the Ferrari for a weekend. Zero paperwork, zero stress. The car was immaculate. Rovio has completely changed how I think about rentals.", name: "Arjun Rawat", city: "Mumbai", rating: 5, vehicle: "Ferrari Roma", initials: "AR" },
  { quote: "Rented the Thar for a Coorg trip with friends. Beast of a machine. Delivery was on time, pickup was smooth. Will absolutely be back.", name: "Priya Sharma", city: "Bangalore", rating: 5, vehicle: "Mahindra Thar", initials: "PS" },
  { quote: "The BMW 5 Series for our anniversary dinner — our jaws dropped. Rovio's fleet is unreal. Booked in literally 90 seconds.", name: "Karan Mehta", city: "Delhi", rating: 5, vehicle: "BMW 5 Series", initials: "KM" },
  { quote: "Finally a rental platform that doesn't feel like a government office. Slick, fast, reliable. Rode the Bullet all the way to Manali.", name: "Sneha Iyer", city: "Chennai", rating: 5, vehicle: "Royal Enfield Bullet", initials: "SI" },
];

// ─── NavBar ───────────────────────────────────────────────────────────────────

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#030305]/95 backdrop-blur-2xl border-b border-white/5" : ""}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-[70px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-[#C8102E] flex items-center justify-center">
            <span className="font-syne font-black text-white text-xs tracking-tighter">RV</span>
          </div>
          <span className="font-syne font-black text-white text-xl tracking-tight">ROVIO</span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-1">
          {[["Home", "/"], ["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
            <Link key={label} href={href}
              className="px-4 py-2 text-[13px] font-light text-[#6B7280] hover:text-white rounded-md hover:bg-white/5 transition-all duration-200 tracking-wide">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/vehicles"
            className="text-[13px] font-medium text-[#6B7280] hover:text-white transition-colors duration-200 tracking-wide">
            Browse fleet
          </Link>
          <Link href="/vehicles"
            className="flex items-center gap-2 bg-[#C8102E] hover:bg-[#E11D48] text-white text-[13px] font-semibold px-5 py-2.5 rounded-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(200,16,46,0.4)]">
            BOOK NOW
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-[5px] p-1.5" aria-label="Menu">
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}/>
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}/>
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}/>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-80" : "max-h-0"}`}>
        <div className="bg-[#030305]/98 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {[["Home", "/"], ["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)}
              className="py-3 text-sm text-[#6B7280] hover:text-white border-b border-white/5 transition-colors">
              {label}
            </Link>
          ))}
          <Link href="/vehicles" onClick={() => setMobileOpen(false)}
            className="mt-3 flex justify-center bg-[#C8102E] text-white text-sm font-semibold py-3 rounded-sm tracking-wider">
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  const words = ["ROAD.", "CITY.", "HILLS.", "JOURNEY."];
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % words.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030305]">

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }} />

      {/* Red glow blobs */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-[#C8102E]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-[#C8102E]/5 blur-[80px] pointer-events-none" />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-syne font-black text-[20vw] text-white/[0.015] leading-none tracking-tighter whitespace-nowrap">ROVIO</span>
      </div>

      {/* Diagonal accent line */}
      <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-28 pb-16 w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-[#C8102E]" />
          <span className="text-[#C8102E] text-[11px] font-semibold tracking-[0.25em] uppercase">Premium Vehicle Rentals · India</span>
        </div>

        {/* Headline */}
        <h1 className="font-syne font-black leading-[0.92] tracking-tight mb-8">
          <span className="block text-[clamp(3.5rem,8vw,8rem)] text-white">OWN THE</span>
          <span className="block text-[clamp(3.5rem,8vw,8rem)] text-white relative">
            <span
              className="text-[#C8102E] transition-opacity duration-300"
              style={{ opacity: fade ? 1 : 0 }}
            >
              {words[wordIdx]}
            </span>
          </span>
        </h1>

        {/* Sub */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <p className="text-[#6B7280] text-lg md:text-xl font-light leading-relaxed max-w-md">
            Rent top-notch cars &amp; bikes. Fast booking, zero hassle, incredible machines — from city hatchbacks to Italian supercars.
          </p>

          <div className="flex flex-col gap-3 shrink-0">
            <Link href="/vehicles"
              className="inline-flex items-center justify-center gap-3 bg-[#C8102E] hover:bg-[#E11D48] text-white font-semibold text-sm px-8 py-4 rounded-sm tracking-widest uppercase transition-all duration-200 hover:shadow-[0_0_30px_rgba(200,16,46,0.5)] hover:-translate-y-0.5">
              Browse Fleet
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/about"
              className="inline-flex items-center justify-center gap-2 text-[#6B7280] hover:text-white text-sm font-light tracking-widest uppercase border border-white/10 hover:border-white/25 px-8 py-4 rounded-sm transition-all duration-200">
              How It Works
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden">
          {[
            { num: "50+",  label: "Vehicles in fleet" },
            { num: "12K+", label: "Happy renters" },
            { num: "4.9",  label: "Average rating" },
            { num: "24/7", label: "Customer support" },
          ].map(({ num, label }) => (
            <div key={label} className="bg-[#030305] px-8 py-6 hover:bg-white/[0.02] transition-colors group">
              <div className="font-syne font-black text-3xl md:text-4xl text-white group-hover:text-[#C8102E] transition-colors duration-300">{num}</div>
              <div className="text-[#4B5563] text-xs font-light tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/60 animate-[scrollLine_1.5s_ease-in-out_infinite]" />
        <span className="text-white text-[10px] tracking-[0.3em] uppercase">Scroll</span>
      </div>
    </section>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function BrandTicker() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <div className="border-y border-white/5 bg-[#08080D] py-[14px] overflow-hidden">
      <div className="flex animate-ticker w-max">
        {doubled.map((b, i) => (
          <div key={i} className="flex items-center gap-5 px-6 text-[11px] font-semibold tracking-[0.2em] text-[#374151] uppercase whitespace-nowrap">
            <span className="w-[3px] h-[3px] rounded-full bg-[#C8102E] shrink-0" />
            {b}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────

function VehiclesSection() {
  const [active, setActive] = useState<Category>("ALL");
  const categories: Category[] = ["ALL", "CARS", "BIKES", "LUXURY", "SUV"];
  const filtered = VEHICLES.filter(v => v.categories.includes(active));

  return (
    <section className="bg-[#030305] py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#C8102E]" />
              <span className="text-[#C8102E] text-[11px] font-semibold tracking-[0.25em] uppercase">Our Fleet</span>
            </div>
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white tracking-tight leading-[0.95]">
              BROWSE<br />VEHICLES
            </h2>
          </div>
          <p className="text-[#4B5563] text-sm font-light leading-relaxed max-w-xs">
            Hand-picked, serviced, and insured. Every vehicle is road-ready and waiting for you.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-10 border-b border-white/5 pb-0">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 border-b-2 -mb-px ${
                active === cat
                  ? "border-[#C8102E] text-white"
                  : "border-transparent text-[#4B5563] hover:text-[#9CA3AF]"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link href="/vehicles"
            className="flex items-center gap-3 text-[#4B5563] hover:text-white text-xs tracking-[0.25em] uppercase font-semibold border border-white/10 hover:border-white/25 px-8 py-4 rounded-sm transition-all duration-200">
            View All Vehicles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle: v }: { vehicle: Vehicle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[#08080D] flex flex-col transition-all duration-300 group cursor-pointer"
      style={{ boxShadow: hovered ? `inset 0 0 0 1px ${v.accentColor}40` : "none" }}
    >
      {/* Image area */}
      <div className="relative h-52 flex items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(ellipse at center, ${v.accentColor}18 0%, #08080D 70%)` }}>

        {/* Tag */}
        {v.tag && (
          <div className="absolute top-4 right-4 bg-[#C8102E] text-white text-[9px] font-black tracking-[0.2em] px-2.5 py-1 rounded-sm">
            {v.tag}
          </div>
        )}

        {/* Big emoji / placeholder */}
        <div className="text-7xl select-none transition-transform duration-500 group-hover:scale-110">
          {v.emoji}
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#08080D] to-transparent" />

        {/* Brand watermark */}
        <div className="absolute bottom-3 left-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/20">
          {v.brand}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 border-t border-white/5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-[11px] font-light tracking-widest uppercase text-[#4B5563] mb-1">{v.type}</div>
            <h3 className="font-syne font-bold text-white text-lg leading-tight">
              {v.brand} <span className="text-[#9CA3AF] font-normal">{v.name}</span>
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="font-syne font-black text-xl text-white">
              ₹{v.price.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-[#4B5563] tracking-wider">/day</div>
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[v.fuel, `${v.seats} seats`, v.cc ?? v.transmission].map(spec => (
            <span key={spec} className="text-[10px] font-medium tracking-wider text-[#6B7280] bg-white/5 px-2.5 py-1 rounded-sm uppercase">
              {spec}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Link href={`/vehicles/${v.id}`}
            className="flex-1 text-center text-[11px] font-semibold tracking-[0.15em] uppercase text-[#6B7280] hover:text-white border border-white/8 hover:border-white/20 py-3 rounded-sm transition-all duration-200">
            Details
          </Link>
          <Link href={`/vehicles/${v.id}`}
            className="flex-1 text-center text-[11px] font-semibold tracking-[0.15em] uppercase bg-[#C8102E] hover:bg-[#E11D48] text-white py-3 rounded-sm transition-all duration-200">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Why Section ──────────────────────────────────────────────────────────────

function WhySection() {
  const features = [
    { num: "01", title: "Instant Booking", body: "Confirm your vehicle in under 2 minutes. No queues, no paperwork, no phone calls." },
    { num: "02", title: "Fully Insured",   body: "Comprehensive insurance on every vehicle. Ride with complete peace of mind." },
    { num: "03", title: "Verified Fleet",  body: "Every vehicle is inspected, serviced, and road-ready before each rental." },
    { num: "04", title: "24/7 Support",    body: "Our team is always reachable. Breakdown, question, or emergency — we've got you." },
  ];

  return (
    <section className="bg-[#06060A] border-y border-white/5 py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#C8102E]" />
              <span className="text-[#C8102E] text-[11px] font-semibold tracking-[0.25em] uppercase">Why Rovio</span>
            </div>
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white tracking-tight leading-[0.95]">
              THE SMARTER<br />WAY TO RENT
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {features.map((f) => (
            <div key={f.num} className="bg-[#06060A] p-8 hover:bg-[#0A0A10] transition-colors duration-300 group">
              <div className="font-syne font-black text-4xl text-white/5 group-hover:text-[#C8102E]/20 transition-colors duration-500 mb-6 leading-none">
                {f.num}
              </div>
              <h3 className="font-syne font-bold text-white text-base tracking-tight mb-3">{f.title}</h3>
              <p className="text-[#4B5563] text-sm font-light leading-relaxed">{f.body}</p>
              <div className="mt-6 w-8 h-px bg-[#C8102E]/0 group-hover:bg-[#C8102E] transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        cards.forEach((c, i) => setTimeout(() => {
          c.style.opacity = "1";
          c.style.transform = "translateY(0)";
        }, i * 120));
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#030305] py-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#C8102E]" />
              <span className="text-[#C8102E] text-[11px] font-semibold tracking-[0.25em] uppercase">Reviews</span>
            </div>
            <h2 className="font-syne font-black text-5xl md:text-6xl text-white tracking-tight leading-[0.95]">
              WHAT THEY<br />SAY
            </h2>
          </div>
          <p className="text-[#4B5563] text-sm font-light max-w-xs leading-relaxed">
            Real reviews from verified renters across India. No filters, no fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} data-reveal
              className="bg-[#030305] p-8 md:p-10 transition-all duration-700 ease-out hover:bg-[#060609]"
              style={{ opacity: 0, transform: "translateY(24px)" }}>

              {/* Stars */}
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#C8102E"><path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/></svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[#D1D5DB] text-base md:text-lg font-light leading-relaxed mb-8 border-l-2 border-[#C8102E]/50 pl-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Person */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-[#C8102E]/15 border border-[#C8102E]/30 flex items-center justify-center">
                  <span className="font-syne font-black text-xs text-[#C8102E]">{t.initials}</span>
                </div>
                <div>
                  <div className="font-syne font-bold text-white text-sm">{t.name}</div>
                  <div className="text-[#4B5563] text-xs font-light mt-0.5">
                    {t.city} &bull; Rented <span className="text-[#6B7280]">{t.vehicle}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-1 text-[#059669] text-[10px] font-semibold tracking-wider">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M5 0a5 5 0 100 10A5 5 0 005 0zm2.3 3.8L4.5 6.6 2.7 4.8a.5.5 0 10-.7.7l2.2 2.1a.5.5 0 00.7 0l3.1-3a.5.5 0 00-.7-.8z"/></svg>
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="bg-[#030305] px-6 md:px-12 pb-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative bg-[#C8102E] overflow-hidden rounded-sm">

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)",
            }} />

          {/* Content */}
          <div className="relative z-10 px-10 md:px-16 py-14 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="font-syne font-black text-4xl md:text-5xl text-white leading-[0.95] tracking-tight mb-3">
                READY TO<br />HIT THE ROAD?
              </div>
              <p className="text-white/60 text-sm font-light">Book your vehicle in under 2 minutes. No deposits required.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/vehicles"
                className="inline-flex items-center justify-center gap-3 bg-white text-[#C8102E] font-black text-sm px-8 py-4 rounded-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-200">
                BROWSE FLEET
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white text-sm font-semibold px-8 py-4 rounded-sm border border-white/30 hover:border-white/60 tracking-widest uppercase transition-all duration-200">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#030305] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

        {/* Logo + tagline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-sm bg-[#C8102E] flex items-center justify-center">
              <span className="font-syne font-black text-white text-[9px]">RV</span>
            </div>
            <span className="font-syne font-black text-white text-lg tracking-tight">ROVIO</span>
          </div>
          <p className="text-[#374151] text-xs font-light tracking-wide">Premium vehicle rentals across India.</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6">
          {[["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"], ["Privacy", "/privacy"]].map(([label, href]) => (
            <Link key={label} href={href}
              className="text-[#374151] hover:text-[#9CA3AF] text-xs tracking-widest uppercase font-light transition-colors duration-200">
              {label}
            </Link>
          ))}
        </div>

        {/* Copy */}
        <p className="text-[#1F2937] text-xs tracking-wider">
          © {new Date().getFullYear()} ROVIO RENTALS
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-[#030305] text-white">
      <NavBar />
      <HeroSection />
      <BrandTicker />
      <VehiclesSection />
      <WhySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}