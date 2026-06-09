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
                href === "/contact" ? "text-white" : "text-white/40 hover:text-white/80"
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

// ─── Contact Info Card ────────────────────────────────────────────────────────

function InfoCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#141416] border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.13] transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-[#E11D48]/[0.1] flex items-center justify-center text-sm mb-4 group-hover:bg-[#E11D48]/[0.18] transition-colors">
        {icon}
      </div>
      <p className="text-white/30 text-[10px] tracking-[0.08em] uppercase mb-1">{label}</p>
      <p className="text-white text-[13px] font-medium">{value}</p>
      {sub && <p className="text-white/30 text-[11px] mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStatus("loading");
    // Simulate async submit — replace with real API call when ready
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("success");
  };

  const inputClass = "w-full bg-[#0C0C0E] border border-white/[0.08] rounded-md px-4 py-3 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors duration-150";
  const labelClass = "block text-[11px] text-white/40 tracking-[0.06em] uppercase mb-1.5";

  return (
    <main className="bg-[#0C0C0E] text-white min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-[60px] border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-14 md:py-20">
          <p className="text-[#E11D48] text-[11px] font-medium tracking-[0.1em] uppercase mb-3">Contact</p>
          <h1 className="font-syne font-semibold text-[2rem] md:text-[3rem] text-white tracking-[-0.03em] leading-[1.05] mb-4">
            Get in touch
          </h1>
          <p className="text-white/40 text-[14px] leading-[1.75] font-light max-w-md">
            Have a question about a vehicle, a booking, or anything else? We typically respond within a few hours.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-10 px-5 md:px-10 border-b border-white/[0.06] bg-[#0A0A0C]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard icon="📍" label="Location"     value="Indore, MP"          sub="Madhya Pradesh, India" />
          <InfoCard icon="📞" label="Phone"        value="+91 98765 43210"     sub="Mon–Sat, 9am–7pm" />
          <InfoCard icon="✉️" label="Email"        value="hello@rovio.in"      sub="We reply within 4 hours" />
          <InfoCard icon="⏰" label="Support hours" value="24/7 on WhatsApp"   sub="Emergencies anytime" />
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-14 md:py-20 px-5 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <h2 className="font-syne font-semibold text-[1.4rem] text-white tracking-[-0.02em] mb-6">Send us a message</h2>

            {status === "success" ? (
              <div className="bg-[#141416] border border-[#34D399]/20 rounded-xl p-8 text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-syne font-semibold text-white text-[16px] mb-2">Message sent!</h3>
                <p className="text-white/40 text-[13px] leading-[1.6]">We&apos;ve received your message and will get back to you within a few hours.</p>
                <button
                  onClick={() => { setStatus("idle"); setForm({ name: user?.name ?? "", email: user?.email ?? "", subject: "", message: "" }); }}
                  className="mt-5 text-[#E11D48] text-[13px] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name <span className="text-[#E11D48]">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email <span className="text-[#E11D48]">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className={inputClass + " cursor-pointer appearance-none"}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='rgba(255,255,255,0.3)' stroke-width='1.3' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                    <option value="">Select a topic</option>
                    <option value="booking">Booking enquiry</option>
                    <option value="vehicle">Vehicle question</option>
                    <option value="support">Support / issue</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message <span className="text-[#E11D48]">*</span></label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us what's on your mind..." rows={5}
                    className={inputClass + " resize-none"} />
                </div>

                {error && (
                  <p className="text-[#F87171] text-[12px] flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm.5 7.5h-1v-1h1v1zm0-2.5h-1V3h1v3z"/></svg>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium px-7 py-3.5 rounded-md transition-all duration-150 self-start">
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20" strokeDashoffset="10"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ — 2 cols */}
          <div className="lg:col-span-2">
            <h2 className="font-syne font-semibold text-[1.4rem] text-white tracking-[-0.02em] mb-6">Common questions</h2>
            <div className="flex flex-col gap-3">
              {[
                { q: "What documents do I need?", a: "A valid driving licence and a government-issued ID (Aadhaar or Passport). For luxury vehicles, we may require an additional deposit." },
                { q: "Is there a minimum rental period?", a: "Our minimum rental is 1 day (24 hours). You can book for multiple days at a discounted daily rate." },
                { q: "Do you offer delivery?", a: "Yes, we offer vehicle delivery to your location within Indore for a small fee. Check during booking." },
                { q: "What happens if I return late?", a: "Late returns are charged at the hourly rate. Please inform us in advance if you need to extend your booking." },
                { q: "Is fuel included?", a: "Vehicles are provided with a full tank. You return them with the same level, or we charge for the difference." },
              ].map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#141416] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/[0.13] transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3">
        <span className="text-[13px] text-white/80 font-medium">{q}</span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`shrink-0 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-40" : "max-h-0"}`}>
        <p className="px-4 pb-4 text-white/40 text-[12px] leading-[1.65]">{a}</p>
      </div>
    </div>
  );
}