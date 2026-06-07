"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleBook = (e: React.MouseEvent) => {
    if (!user) { e.preventDefault(); router.push("/login?redirect=/vehicles"); }
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
                href === "/about" ? "text-white" : "text-white/40 hover:text-white/80"
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
            <Link href="/login" className="text-[13px] text-white/50 hover:text-white/80 border border-white/20 hover:border-white/40 px-4 py-2 rounded-md transition-all duration-150">Sign in</Link>
          )}
          <Link href="/vehicles" onClick={handleBook}
            className="flex items-center gap-1.5 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-4 py-2 rounded-md transition-colors duration-150">
            Book now
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
              className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors last:border-b-0">{label}</Link>
          ))}
          {user ? (
            <Link href="/profile" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">Profile ({user.name})</Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="py-3 text-[13px] text-white/50 hover:text-white border-b border-white/[0.04] transition-colors">Sign in</Link>
          )}
          <Link href="/vehicles" onClick={(e) => { setOpen(false); handleBook(e); }} className="mt-3 flex justify-center bg-[#E11D48] text-white text-[13px] font-medium py-2.5 rounded-md">Book now</Link>
        </div>
      </div>
    </header>
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

const TIMELINE = [
  { year: "2021", title: "Founded in Indore", body: "Rovio started as a small fleet of 5 vehicles, driven by a simple idea: rentals should be effortless." },
  { year: "2022", title: "Fleet expansion", body: "Grew to 20+ vehicles including luxury sedans and off-road SUVs. Launched the online booking system." },
  { year: "2023", title: "12,000 renters", body: "Hit our milestone of 12,000 happy renters. Expanded to bikes and scooters." },
  { year: "2024", title: "Premium fleet", body: "Added the Ferrari Roma and Bentley Continental. Partnered with top insurance providers." },
];

const TEAM = [
  { name: "Ehtesham MD",    role: "Founder & CEO",        initials: "EM", color: "rgba(225,29,72,0.15)",   border: "rgba(225,29,72,0.3)"   },
  { name: "Priya Sharma",   role: "Head of Operations",   initials: "PS", color: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)"  },
  { name: "Karan Mehta",    role: "Fleet Manager",        initials: "KM", color: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)"  },
  { name: "Sneha Iyer",     role: "Customer Experience",  initials: "SI", color: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.3)"  },
];

const VALUES = [
  { icon: "⚡", title: "Speed",        body: "Every process is designed to be fast. Booking confirmed in under 2 minutes." },
  { icon: "🛡️", title: "Trust",        body: "Every vehicle is insured, inspected, and verified. Zero compromises on safety." },
  { icon: "💎", title: "Quality",      body: "From economy to elite — every vehicle in our fleet meets our quality bar." },
  { icon: "🤝", title: "Transparency", body: "No hidden fees, no surprises. The price you see is the price you pay." },
];

export default function AboutPage() {
  return (
    <main className="bg-[#0C0C0E] text-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-[60px] bg-[#0C0C0E]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-24">
          <div className="max-w-2xl">
            <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">About Rovio</p>
            <h1 className="font-syne font-semibold text-[2rem] md:text-[3.2rem] text-white tracking-[-0.03em] leading-[1.05] mb-5">
              We make renting<br />feel effortless.
            </h1>
            <p className="text-white/40 text-[15px] leading-[1.75] font-light">
              Rovio was built on one belief: renting a vehicle should be as easy as ordering food. No queues, no paperwork, no confusion — just you, a great vehicle, and the open road.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border border-white/[0.07] rounded-xl overflow-hidden mt-12">
            {[
              { n: "50+",  l: "Vehicles in fleet" },
              { n: "12k+", l: "Happy renters" },
              { n: "4.9★", l: "Average rating" },
              { n: "3+",   l: "Years of service" },
            ].map(({ n, l }, i) => (
              <div key={l} className={`px-6 py-6 bg-[#0C0C0E] hover:bg-white/[0.02] transition-colors group ${i < 3 ? "border-r border-white/[0.07]" : ""} ${i >= 2 ? "border-t border-white/[0.07] md:border-t-0" : ""}`}>
                <div className="font-syne font-semibold text-[1.6rem] text-white group-hover:text-[#E11D48] transition-colors duration-200">{n}</div>
                <div className="text-white/30 text-[11px] tracking-[0.04em] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-y border-white/[0.06] bg-[#0A0A0C] py-14 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Our Mission</p>
            <h2 className="font-syne font-semibold text-[1.8rem] md:text-[2.4rem] text-white tracking-[-0.03em] leading-[1.1] mb-5">
              Redefining vehicle rentals in India
            </h2>
            <p className="text-white/40 text-[14px] leading-[1.75] font-light mb-4">
              We believe everyone deserves access to a great vehicle — whether it's a ₹500/day scooter for a quick errand or an ₹18,000/day Bentley for a special occasion.
            </p>
            <p className="text-white/40 text-[14px] leading-[1.75] font-light">
              Our mission is to build the most trusted, most convenient rental experience in the country — one booking at a time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-[#0C0C0E] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.13] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#E11D48]/[0.1] flex items-center justify-center text-sm mb-3 group-hover:bg-[#E11D48]/[0.18] transition-colors">
                  {v.icon}
                </div>
                <h3 className="font-syne font-semibold text-white text-[13px] mb-1.5">{v.title}</h3>
                <p className="text-white/30 text-[11px] leading-[1.6]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Our journey</p>
          <h2 className="font-syne font-semibold text-[1.8rem] md:text-[2.4rem] text-white tracking-[-0.03em] leading-[1.1] mb-10">
            How we got here
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] -translate-x-px hidden sm:block" />
            <div className="flex flex-col gap-8">
              {TIMELINE.map((t, i) => (
                <div key={t.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.13] transition-colors inline-block w-full md:max-w-sm">
                      <span className="text-[#E11D48] text-[11px] font-semibold tracking-[0.1em]">{t.year}</span>
                      <h3 className="font-syne font-semibold text-white text-[15px] mt-1 mb-2">{t.title}</h3>
                      <p className="text-white/35 text-[12px] leading-[1.65]">{t.body}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="hidden md:flex absolute left-1/2 top-5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E11D48] ring-4 ring-[#0C0C0E]" />
                  {/* Spacer */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-white/[0.06] bg-[#0A0A0C] py-14 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">The team</p>
          <h2 className="font-syne font-semibold text-[1.8rem] md:text-[2.4rem] text-white tracking-[-0.03em] leading-[1.1] mb-10">
            People behind Rovio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-[#0C0C0E] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.13] transition-colors text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                  style={{ background: m.color, border: `1px solid ${m.border}` }}>
                  <span className="font-syne font-semibold text-[13px]" style={{ color: m.border }}>{m.initials}</span>
                </div>
                <div className="font-syne font-semibold text-white text-[13px]">{m.name}</div>
                <div className="text-white/30 text-[11px] mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-[#141416] border border-white/[0.07] rounded-xl px-6 md:px-14 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#E11D48]/[0.05] blur-[80px] pointer-events-none translate-x-1/4 -translate-y-1/4" />
            <div className="relative">
              <h2 className="font-syne font-semibold text-[1.7rem] md:text-[2.2rem] text-white tracking-[-0.03em] leading-[1.1] mb-2">
                Ready to ride with us?
              </h2>
              <p className="text-white/35 text-[13px] leading-[1.6]">Browse our fleet and book in under 2 minutes.</p>
            </div>
            <div className="relative flex flex-wrap gap-2.5 shrink-0">
              <Link href="/vehicles" className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white text-[13px] font-medium px-7 py-3.5 rounded-md transition-all duration-150 hover:-translate-y-px">
                Browse fleet
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center text-white/40 hover:text-white/70 text-[13px] px-7 py-3.5 rounded-md border border-white/[0.09] hover:border-white/[0.18] transition-all duration-150">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}