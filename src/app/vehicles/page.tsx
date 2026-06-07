"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Category = "All" | "Cars" | "Bikes" | "Luxury" | "SUV";
type SortOption = "recommended" | "price-asc" | "price-desc";

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
  description: string;
}

const VEHICLES: Vehicle[] = [
  { id: 1,  name: "Roma",        brand: "Ferrari",       type: "Sports Car",   emoji: "🏎️", price: 12000, tag: "Hot",         fuel: "Petrol", seats: 2, transmission: "Auto",   categories: ["All","Cars","Luxury"], description: "560hp Italian masterpiece. Turn heads on every road." },
  { id: 2,  name: "5 Series",    brand: "BMW",           type: "Sedan",        emoji: "🚗", price: 8000,  tag: "Luxury",      fuel: "Diesel", seats: 5, transmission: "Auto",   categories: ["All","Cars","Luxury"], description: "Executive comfort meets driving precision." },
  { id: 3,  name: "E-Class",     brand: "Mercedes-Benz", type: "Luxury Sedan", emoji: "🚗", price: 9500,  tag: "Luxury",      fuel: "Diesel", seats: 5, transmission: "Auto",   categories: ["All","Cars","Luxury"], description: "Refined luxury with cutting-edge technology." },
  { id: 4,  name: "Continental", brand: "Bentley",       type: "Grand Tourer", emoji: "🏎️", price: 18000, tag: "Elite",       fuel: "Petrol", seats: 4, transmission: "Auto",   categories: ["All","Cars","Luxury"], description: "The pinnacle of grand touring. Unrivalled craftsmanship." },
  { id: 5,  name: "CX-5",       brand: "Mazda",         type: "SUV",          emoji: "🚙", price: 5000,  tag: "Popular",     fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars","SUV"],    description: "Premium SUV with panoramic sunroof and BOSE audio." },
  { id: 6,  name: "Thar",       brand: "Mahindra",      type: "Off-Road SUV", emoji: "🚙", price: 4500,                      fuel: "Diesel", seats: 4, transmission: "Manual", categories: ["All","Cars","SUV"],    description: "Built for adventure. Go anywhere, anytime." },
  { id: 7,  name: "Scorpio N",  brand: "Mahindra",      type: "SUV",          emoji: "🚙", price: 4000,                      fuel: "Diesel", seats: 7, transmission: "Manual", categories: ["All","Cars","SUV"],    description: "Bold, powerful SUV that commands attention." },
  { id: 8,  name: "City",       brand: "Honda",         type: "Sedan",        emoji: "🚗", price: 2800,  tag: "Value",       fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars"],          description: "India's favourite sedan. Smooth, spacious and efficient." },
  { id: 9,  name: "Hector",     brand: "MG",            type: "SUV",          emoji: "🚙", price: 3800,                      fuel: "Petrol", seats: 5, transmission: "Auto",   categories: ["All","Cars","SUV"],    description: "Connected SUV with smart infotainment and sunroof." },
  { id: 10, name: "Bolero",     brand: "Mahindra",      type: "Utility SUV",  emoji: "🚙", price: 3200,                      fuel: "Diesel", seats: 7, transmission: "Manual", categories: ["All","Cars","SUV"],    description: "Dependable workhorse for city streets and rough terrain." },
  { id: 11, name: "Bullet 350", brand: "Royal Enfield", type: "Cruiser",      emoji: "🏍️", price: 1500,  tag: "Iconic",      fuel: "Petrol", seats: 2, cc: "350cc", transmission: "Manual", categories: ["All","Bikes"], description: "Legendary thumper for highway cruising." },
  { id: 12, name: "Activa 6G",  brand: "Honda",         type: "Scooter",      emoji: "🛵", price: 600,   tag: "Best Seller", fuel: "Petrol", seats: 2, cc: "110cc", transmission: "Auto",   categories: ["All","Bikes"], description: "India's best-selling scooter. Easy, efficient, reliable." },
  { id: 13, name: "Splendor+",  brand: "Hero",          type: "Commuter",     emoji: "🏍️", price: 500,                       fuel: "Petrol", seats: 2, cc: "100cc", transmission: "Manual", categories: ["All","Bikes"], description: "Lightweight, fuel-efficient daily commuter." },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleBook = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push("/login?redirect=/vehicles");
    }
  };

  const links = [["Home", "/"], ["Vehicles", "/vehicles"], ["About", "/about"], ["Contact", "/contact"]] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0C0C0E]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-5 md:px-10 flex items-center justify-between h-[60px]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-[26px] h-[26px] rounded-[5px] bg-[#E11D48] flex items-center justify-center">
            <span className="font-syne font-bold text-white text-[9px] tracking-tight">RV</span>
          </div>
          <span className="font-syne font-semibold text-white text-[15px] tracking-[0.02em]">Rovio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(([label, href]) => (
            <Link key={label} href={href}
              className={`px-3.5 py-2 text-[13px] rounded-md hover:bg-white/[0.04] transition-all duration-150 ${
                href === "/vehicles" ? "text-white" : "text-white/40 hover:text-white/80"
              }`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/profile" className="text-[13px] text-white/70 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-md transition-all duration-150 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#E11D48]/20 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#E11D48]">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              Profile
            </Link>
          ) : (
            <Link href="/login" className="text-[13px] text-white/50 hover:text-white/80 border border-white/20 hover:border-white/40 px-4 py-2 rounded-md transition-all duration-150">
              Sign in
            </Link>
          )}
          <Link href="/vehicles" onClick={handleBook}
            className="flex items-center gap-1.5 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-150">
            Book now
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="md:hidden flex flex-col gap-[5px] p-1">
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 origin-center ${open ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-[18px] h-px bg-white/70 transition-all duration-200 origin-center ${open ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </div>

      <div className={`md:hidden transition-all duration-250 overflow-hidden ${open ? "max-h-72" : "max-h-0"}`}>
        <div className="bg-[#0C0C0E]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 flex flex-col gap-px">
          {links.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}
              className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors last:border-b-0">
              {label}
            </Link>
          ))}
          {user ? (
            <Link href="/profile" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">
              Profile ({user.name})
            </Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">
              Sign in
            </Link>
          )}
          <Link href="/vehicles" onClick={(e) => { setOpen(false); handleBook(e); }}
            className="mt-3 flex justify-center bg-[#E11D48] text-white text-[13px] font-medium py-2.5 rounded-md">
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ v }: { v: Vehicle }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleBook = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push(`/login?redirect=/vehicles/${v.id}`);
    }
  };

  return (
    <div className="group bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.14] hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="h-[120px] flex flex-col justify-between p-3 relative">
        <div className="absolute inset-0 bg-[#0C0C0E]" />
        <div className="absolute inset-0 opacity-40" style={{
          background: `radial-gradient(ellipse at 70% 40%, ${
            v.categories.includes("Luxury") ? "rgba(120,80,200,0.15)" :
            v.categories.includes("Bikes") ? "rgba(234,88,12,0.12)" :
            v.categories.includes("SUV") ? "rgba(21,128,61,0.1)" :
            "rgba(225,29,72,0.08)"
          } 0%, transparent 70%)`
        }} />
        {v.tag ? (
          <span className="relative self-end text-[9px] font-semibold text-white/70 bg-white/[0.08] px-2 py-0.5 rounded tracking-[0.06em]">{v.tag}</span>
        ) : <span />}
        <div className="relative flex items-center justify-center text-[44px] leading-none select-none group-hover:scale-105 transition-transform duration-300">
          {v.emoji}
        </div>
      </div>

      <div className="p-3.5 border-t border-white/[0.06] flex flex-col flex-1">
        <p className="text-white/30 text-[10px] tracking-[0.06em] mb-0.5">{v.type}</p>
        <div className="flex items-start justify-between gap-1 mb-2">
          <h3 className="font-syne font-semibold text-white text-[14px] leading-tight">
            {v.brand} <span className="font-normal text-white/50">{v.name}</span>
          </h3>
          <div className="text-right shrink-0">
            <div className="font-syne font-semibold text-white text-[15px]">₹{v.price.toLocaleString("en-IN")}</div>
            <div className="text-white/25 text-[9px]">/day</div>
          </div>
        </div>

        <p className="text-white/30 text-[11px] leading-[1.6] mb-3">{v.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {[v.fuel, `${v.seats} seats`, v.cc ?? v.transmission].map((s) => (
            <span key={s} className="text-[10px] text-white/35 bg-white/[0.05] px-2 py-0.5 rounded-[4px]">{s}</span>
          ))}
        </div>

        <div className="flex gap-1.5 mt-auto">
          <Link href={`/vehicles/${v.id}`}
            className="flex-1 text-center text-[11px] text-white/35 hover:text-white/65 border border-white/[0.08] hover:border-white/[0.16] py-2.5 rounded-md transition-all duration-150">
            Details
          </Link>
          <Link href={`/vehicles/${v.id}`} onClick={handleBook}
            className="flex-1 text-center text-[11px] text-white font-medium bg-[#E11D48] hover:bg-[#F43F5E] py-2.5 rounded-md transition-colors duration-150">
            Book now
          </Link>
        </div>
      </div>
    </div>
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
            <Link key={l} href={h} className="text-white/25 hover:text-white/55 text-[12px] transition-colors duration-150">{l}</Link>
          ))}
        </div>
        <p className="text-white/15 text-[12px]">© {new Date().getFullYear()} Rovio Rentals</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VehiclesPage() {
  const [active, setActive] = useState<Category>("All");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [search, setSearch] = useState("");

  const categories: Category[] = ["All", "Cars", "Bikes", "Luxury", "SUV"];

  const filtered = VEHICLES
    .filter((v) => v.categories.includes(active))
    .filter((v) =>
      search === "" ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.type.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.id - b.id;
    });

  return (
    <main className="bg-[#0C0C0E] text-white min-h-screen">
      <Navbar />

      {/* Page header */}
      <section className="pt-[60px] bg-[#0C0C0E] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Our Fleet</p>
              <h1 className="font-syne font-semibold text-[2rem] md:text-[3rem] text-white tracking-[-0.03em] leading-[1.05]">
                Browse vehicles
              </h1>
              <p className="text-white/35 text-[13px] mt-2.5 leading-[1.6]">
                {VEHICLES.length} vehicles available · Hand-picked, insured & road-ready
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-[260px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141416] border border-white/[0.08] rounded-md pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/[0.2] transition-colors duration-150"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Sort */}
      <div className="sticky top-[60px] z-40 bg-[#0C0C0E]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 flex items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-3.5 md:px-5 py-3.5 text-[12px] font-medium tracking-[0.04em] border-b-[1.5px] -mb-px whitespace-nowrap transition-all duration-150 ${
                  active === cat ? "text-white border-[#E11D48]" : "text-white/30 border-transparent hover:text-white/55"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="shrink-0 bg-[#141416] border border-white/[0.08] rounded-md px-3 py-1.5 text-[12px] text-white/50 focus:outline-none focus:border-white/20 transition-colors cursor-pointer appearance-none pr-7"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='rgba(255,255,255,0.3)' stroke-width='1.3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <section className="py-10 md:py-14 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-white/50 text-[14px]">No vehicles found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-4 text-[#E11D48] text-[13px] hover:underline">Clear search</button>
            </div>
          ) : (
            <>
              <p className="text-white/25 text-[12px] mb-6">{filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((v) => <VehicleCard key={v.id} v={v} />)}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}