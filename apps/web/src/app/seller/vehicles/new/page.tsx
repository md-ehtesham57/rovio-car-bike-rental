"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Cars", "Bikes", "Luxury", "SUV"] as const;
const FUEL_TYPES  = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NewVehiclePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
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

  async function handleUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/seller/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, data.data.url]);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5 MB");
        return;
      }
      handleUpload(file);
    }
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/seller/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images }),
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
    <div className="p-7 max-w-[720px]">
      <div className="mb-7">
        <h1 className="font-syne font-bold text-white text-[1.5rem]">Add Vehicle</h1>
        <p className="text-white/30 text-[12px] mt-0.5">List a new car or bike for rent</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141416] border border-white/[0.06] rounded-xl p-6 space-y-5">
        {error && (
          <div className="text-[#E11D48] text-[12px] bg-[#E11D48]/[0.08] border border-[#E11D48]/[0.15] rounded-lg px-4 py-2.5">{error}</div>
        )}

        {/* ─── Image upload ──────────────────────────────────────────────── */}
        <div>
          <label className="block text-white/50 text-[11px] font-medium mb-2 tracking-[0.04em] uppercase">Photos</label>
          <div className="flex flex-wrap gap-2">
            {images.map((url) => (
              <div key={url} className="relative w-[100px] h-[80px] rounded-lg overflow-hidden border border-white/[0.08] group">
                <img src={`${API_URL}${url}`} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(url)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading || images.length >= 10}
              className="w-[100px] h-[80px] border-2 border-dashed border-white/[0.1] rounded-lg flex flex-col items-center justify-center gap-1 text-white/25 hover:text-white/50 hover:border-white/20 transition-colors disabled:opacity-30">
              {uploading ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M9 2a7 7 0 017 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  <span className="text-[9px]">Add photo</span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleFile} />
          </div>
          <p className="text-white/20 text-[10px] mt-1.5">JPEG, PNG, WebP or AVIF · Max 5 MB each · Up to 10 photos</p>
        </div>

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
