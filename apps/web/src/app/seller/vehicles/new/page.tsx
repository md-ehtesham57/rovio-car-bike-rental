"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Cars", "Bikes", "Luxury", "SUV"] as const;
const FUEL_TYPES  = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;

export default function NewVehiclePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", brand: "", type: "", emoji: "🚗",
    pricePerDay: 0, fuel: "Petrol" as string, seats: 2,
    cc: "", transmission: "Manual" as string,
    categories: [] as string[], description: "",
    available: true,
  });

  function toggleCat(cat: string) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/seller/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      router.push("/seller/vehicles");
    } else {
      setError(data.message || "Failed to create vehicle");
    }
    setBusy(false);
  }

  return (
    <div className="p-7 max-w-[600px]">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Add Vehicle</h1>
        <p className="text-white/30 text-[12px] mt-0.5">List a new car or bike for rent</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.06] rounded-xl p-6 space-y-5">
        {error && (
          <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.08] border border-[#E11D48]/[0.15] rounded-lg px-4 py-2.5">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} placeholder="e.g. BMW" />
          <Field label="Model" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. 5 Series" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} placeholder="e.g. Sedan" />
          <div>
            <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Emoji</label>
            <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] outline-none focus:border-[#E11D48]/50 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Price per day (₹)</label>
            <input type="number" min={1} value={form.pricePerDay || ""} onChange={(e) => setForm((f) => ({ ...f, pricePerDay: parseInt(e.target.value) || 0 }))}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] outline-none focus:border-[#E11D48]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Seats</label>
            <input type="number" min={1} max={20} value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: parseInt(e.target.value) || 2 }))}
              className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] outline-none focus:border-[#E11D48]/50 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Fuel" value={form.fuel} onChange={(v) => setForm((f) => ({ ...f, fuel: v }))} options={FUEL_TYPES} />
          <Select label="Transmission" value={form.transmission} onChange={(v) => setForm((f) => ({ ...f, transmission: v }))} options={["Auto", "Manual"]} />
        </div>

        <Field label="Engine (CC)" value={form.cc} onChange={(v) => setForm((f) => ({ ...f, cc: v }))} placeholder="e.g. 2000cc" />

        <div>
          <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                  form.categories.includes(cat)
                    ? "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/25"
                    : "border-white/[0.07] text-white/40 hover:text-white/60"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">Description</label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe your vehicle..."
            className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors resize-none" />
        </div>

        <button type="submit" disabled={busy}
          className="w-full bg-[#E11D48] hover:bg-[#F43F5E] disabled:opacity-50 text-white text-[13px] font-medium py-2.5 rounded-lg transition-colors">
          {busy ? "Submitting..." : "Submit for review"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] placeholder-white/20 outline-none focus:border-[#E11D48]/50 transition-colors" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <label className="block text-white/50 text-[11px] font-medium mb-1.5 tracking-[0.04em] uppercase">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0C0C0E] border border-white/[0.1] rounded-lg px-4 py-2.5 text-white text-[13px] outline-none focus:border-[#E11D48]/50 transition-colors">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
