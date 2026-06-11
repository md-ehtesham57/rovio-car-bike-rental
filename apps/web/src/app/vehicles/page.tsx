"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type Category = "All" | "Cars" | "Bikes" | "Luxury" | "SUV";
type SortOption = "recommended" | "price-asc" | "price-desc";

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
  description: string;
  images?: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MOCK_VEHICLES: Vehicle[] = [
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

interface ApiVehicle {
  _id?: string;
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
}

function mapApiVehicle(v: ApiVehicle): Vehicle {
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
    description: v.description,
    images: v.images,
  };
}

const GRADIENTS: Record<string, string> = {
  Luxury: "from-purple-900/60 via-purple-800/20 to-transparent",
  Cars: "from-rose-900/60 via-rose-800/20 to-transparent",
  Bikes: "from-orange-900/60 via-orange-800/20 to-transparent",
  SUV: "from-emerald-900/60 via-emerald-800/20 to-transparent",
};

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
            <>
              <Link href="/bookings"
                className="text-[13px] text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20 px-4 py-2 rounded-md transition-all duration-150">
                My Bookings
              </Link>
              <Link href="/profile" className="text-[13px] text-white/70 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-md transition-all duration-150 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#E11D48]/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#E11D48]">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                Profile
              </Link>
            </>
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
            <>
              <Link href="/bookings" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">
                My Bookings
              </Link>
              <Link href="/profile" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">
                Profile ({user.name})
              </Link>
            </>
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

function VehicleCard({ v }: { v: Vehicle }) {
  const { user } = useAuth();
  const router = useRouter();
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleBook = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push(`/login?redirect=/vehicles/${v._id || v.id}`);
    }
  };

  const category = v.categories.find((c) => c !== "All") || "Cars";

  return (
    <div className="group bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.14] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image / Emoji area */}
      <div className="relative h-[180px] overflow-hidden bg-[#0C0C0E]">
        {v.images && v.images.length > 0 ? (
          <>
            <img
              ref={imgRef}
              src={`${API_URL}${v.images[0]}`}
              alt={`${v.brand} ${v.name}`}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br opacity-30"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, ${
                  category === "Luxury" ? "rgba(120,80,200,0.25)" :
                  category === "Bikes" ? "rgba(234,88,12,0.2)" :
                  category === "SUV" ? "rgba(21,128,61,0.2)" :
                  "rgba(225,29,72,0.15)"
                } 0%, transparent 70%)`
              }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[56px] select-none group-hover:scale-110 transition-transform duration-300">{v.emoji}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E]/80 via-transparent to-transparent" />
          </>
        )}

        {/* Tag badge */}
        {v.tag && (
          <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-white bg-white/10 backdrop-blur-md px-2 py-0.5 rounded tracking-[0.06em] z-10">
            {v.tag}
          </span>
        )}

        {/* Price */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <div className="font-syne font-bold text-white text-[18px] leading-tight drop-shadow-lg">
            ₹{v.price.toLocaleString("en-IN")}
          </div>
          <div className="text-white/50 text-[10px]">/day</div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-white/30 text-[10px] tracking-[0.06em] mb-0.5 uppercase">{v.type}</p>
        <h3 className="font-syne font-semibold text-white text-[15px] leading-tight mb-1">
          {v.brand} <span className="font-normal text-white/45">{v.name}</span>
        </h3>

        <p className="text-white/25 text-[12px] leading-[1.6] mb-3 line-clamp-2">{v.description}</p>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/[0.05] px-2.5 py-1 rounded-[5px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 3v2l1.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {v.transmission}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/[0.05] px-2.5 py-1 rounded-[5px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5 1v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {v.fuel}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-white/40 bg-white/[0.05] px-2.5 py-1 rounded-[5px]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
            {v.seats} seats
          </span>
          {v.cc && (
            <span className="text-[10px] text-white/40 bg-white/[0.05] px-2.5 py-1 rounded-[5px]">{v.cc}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/vehicles/${v._id || v.id}`}
            className="flex-1 text-center text-[12px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.16] py-2.5 rounded-lg transition-all duration-150">
            Details
          </Link>
          <Link href={`/vehicles/${v._id || v.id}`} onClick={handleBook}
            className="flex-1 text-center text-[12px] text-white font-medium bg-[#E11D48] hover:bg-[#F43F5E] py-2.5 rounded-lg transition-colors duration-150">
            Book now
          </Link>
        </div>
      </div>
    </div>
  );
}

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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [active, setActive] = useState<Category>("All");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(MOCK_VEHICLES.length);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.items)) {
          const api = json.data.items.map(mapApiVehicle);
          setVehicles((prev) => [...api, ...prev]);
          setCount(json.data.total || api.length);
        }
      } catch {
        /* fallback to mock */
      }
    };
    fetchVehicles();
  }, []);

  const categories: Category[] = ["All", "Cars", "Bikes", "Luxury", "SUV"];

  const filtered = vehicles
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
      return b.id - a.id;
    });

  return (
    <main className="bg-[#0C0C0E] text-white min-h-screen">
      <Navbar />

      {/* Hero header */}
      <section className="relative pt-[60px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E11D48]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-[-100px] w-[400px] h-[400px] rounded-full bg-[#E11D48]/3 blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase">Our Fleet</p>
              </div>
              <h1 className="font-syne font-semibold text-[2.5rem] md:text-[4rem] text-white tracking-[-0.03em] leading-[1.05]">
                Browse vehicles
              </h1>
              <p className="text-white/35 text-[14px] mt-3 leading-[1.6]">
                {count} vehicle{count !== 1 ? "s" : ""} available · Every ride insured & road-ready
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-[280px] shrink-0">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search brand or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141416] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/[0.2] focus:bg-[#1a1a1d] transition-all duration-150"
              />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-white/20 text-[12px] mt-6 leading-[1.7] max-w-[500px]">
            Hand-picked, professionally serviced, and fully insured. Every vehicle in our fleet is ready to hit the road.
          </p>
        </div>
      </section>

      {/* Sticky filters bar */}
      <div className="sticky top-[60px] z-40 bg-[#0C0C0E]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 flex items-center justify-between gap-4">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-4 md:px-6 py-3.5 text-[12px] font-medium tracking-[0.04em] border-b-[1.5px] -mb-px whitespace-nowrap transition-all duration-150 ${
                  active === cat
                    ? "text-white border-[#E11D48]"
                    : "text-white/30 border-transparent hover:text-white/55"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="shrink-0 bg-[#141416] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white/50 focus:outline-none focus:border-white/20 transition-colors cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='rgba(255,255,255,0.3)' stroke-width='1.3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
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
              <div className="text-5xl mb-4 opacity-50">🔍</div>
              <p className="text-white/50 text-[14px]">No vehicles found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-4 text-[#E11D48] text-[13px] hover:underline">Clear search</button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/25 text-[12px]">{filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
