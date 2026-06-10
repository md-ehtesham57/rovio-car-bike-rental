"use client";

import { useEffect, useState, useCallback } from "react";

type User = {
  _id: string; name: string; email: string;
  role: string; emailVerified: boolean; isBanned?: boolean;
  lastLoginAt?: string; createdAt: string;
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [role,    setRole]    = useState("all");
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const q = new URLSearchParams({ page: String(page), limit: "20" });
    if (role !== "all") q.set("role", role);
    if (search.trim()) q.set("search", search.trim());
    fetch(`/api/admin/users?${q}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) { setUsers(d.data.items); setTotal(d.data.total); } })
      .finally(() => setLoading(false));
  }, [page, role, search]);

  useEffect(() => { load(); }, [load]);

  async function setUserRole(id: string, newRole: "user" | "admin" | "seller") {
    setBusy(id);
    await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setBusy(null);
    load();
  }

  async function banUser(id: string) {
    if (!confirm("Ban this user? They will be unable to log in.")) return;
    setBusy(id);
    await fetch(`/api/admin/users/${id}/ban`, { method: "POST" });
    setBusy(null);
    load();
  }

  async function unbanUser(id: string) {
    setBusy(id);
    await fetch(`/api/admin/users/${id}/unban`, { method: "POST" });
    setBusy(null);
    load();
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user and cancel their pending bookings?")) return;
    setBusy(id);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setBusy(null);
    load();
  }

  return (
    <div className="p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-bold text-white text-[1.5rem]">Users</h1>
          <p className="text-white/30 text-[12px] mt-0.5">{total} registered accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search name or email…"
          className="bg-[#141416] border border-white/[0.07] rounded-lg px-3.5 py-2 text-white text-[12px] placeholder-white/20 outline-none focus:border-white/[0.15] transition-colors w-52"
        />
        {["all", "user", "admin", "seller"].map((r) => (
          <button key={r} onClick={() => { setRole(r); setPage(1); }}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium capitalize transition-all border ${
              role === r ? "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/25" : "border-white/[0.07] text-white/40 hover:text-white/60"
            }`}>
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141416] border border-white/[0.06] rounded-xl overflow-hidden">
        {loading ? <p className="p-6 text-white/30 text-[12px]">Loading…</p>
        : users.length === 0 ? <p className="p-6 text-white/30 text-[12px]">No users found.</p>
        : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["User", "Role", "Status", "Verified", "Last login", "Joined", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-medium text-white/30 tracking-[0.05em] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.015] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-white text-[12px] font-medium">{u.name}</p>
                    <p className="text-white/30 text-[11px]">{u.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-full border ${
                      u.role === "admin"
                        ? "text-[#E11D48] bg-[#E11D48]/10 border-[#E11D48]/20"
                        : "text-white/40 bg-white/[0.05] border-white/[0.08]"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    {u.isBanned ? (
                      <span className="text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full">Banned</span>
                    ) : (
                      <span className="text-[10px] text-white/30">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] ${u.emailVerified ? "text-green-400" : "text-white/30"}`}>
                      {u.emailVerified ? "✓ Yes" : "✗ No"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-white/35 text-[11px]">{u.lastLoginAt ? fmt(u.lastLoginAt) : "—"}</td>
                  <td className="px-4 py-3.5 text-white/35 text-[11px]">{fmt(u.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      {u.role === "seller" ? (
                        <button
                          onClick={() => setUserRole(u._id, "user")}
                          disabled={busy === u._id}
                          className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                        >
                          Remove seller
                        </button>
                      ) : u.role === "admin" ? (
                        <button
                          onClick={() => setUserRole(u._id, "user")}
                          disabled={busy === u._id}
                          className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                        >
                          Remove admin
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setUserRole(u._id, "seller")}
                            disabled={busy === u._id}
                            className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                          >
                            Make seller
                          </button>
                          <button
                            onClick={() => setUserRole(u._id, "admin")}
                            disabled={busy === u._id}
                            className="text-[11px] text-white/40 hover:text-white/70 border border-white/[0.08] hover:bg-white/[0.05] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                          >
                            Make admin
                          </button>
                        </>
                      )}
                      {u.isBanned ? (
                        <button
                          onClick={() => unbanUser(u._id)}
                          disabled={busy === u._id}
                          className="text-[11px] text-green-400/60 hover:text-green-400 border border-green-400/15 hover:bg-green-400/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() => banUser(u._id)}
                          disabled={busy === u._id}
                          className="text-[11px] text-white/40 hover:text-red-400 border border-white/[0.08] hover:border-red-400/20 hover:bg-red-400/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                        >
                          Ban
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u._id)}
                        disabled={busy === u._id}
                        className="text-[11px] text-[#E11D48]/60 hover:text-[#E11D48] border border-[#E11D48]/15 hover:bg-[#E11D48]/[0.07] px-2.5 py-1 rounded-md transition-all disabled:opacity-30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-[11px]">Page {page} of {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">← Prev</button>
            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}
              className="text-[11px] px-3 py-1.5 border border-white/[0.07] rounded-md text-white/40 hover:text-white/70 disabled:opacity-30 transition-all">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
