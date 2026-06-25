"use client";
import React, { useState } from "react";
import type { LeadsState } from "@/hooks/useLeads";
import type { Lead } from "@/lib/api";
import { useLeadsStats } from "@/hooks/useLeadsStats";

interface Props { leadsState: LeadsState; }

/* ─── Tag styles ─────────────────────────────────────────────────── */
const TAG_BADGE: Record<string, React.ReactNode> = {
  Hot:  <span style={{ background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.5)", color:"#ef4444", boxShadow:"0 0 8px rgba(239,68,68,.3)" }} className="text-xs px-2 py-0.5 rounded-full font-bold">🔥 Hot</span>,
  Warm: <span style={{ background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.5)", color:"#f59e0b", boxShadow:"0 0 6px rgba(245,158,11,.25)" }} className="text-xs px-2 py-0.5 rounded-full font-bold">⚡ Warm</span>,
  Cold: <span style={{ background:"rgba(59,130,246,.15)", border:"1px solid rgba(59,130,246,.5)", color:"#3b82f6", boxShadow:"0 0 6px rgba(59,130,246,.2)" }} className="text-xs px-2 py-0.5 rounded-full font-bold">❄️ Cold</span>,
};

const AVATAR_GRADIENT: Record<string, string> = {
  Hot:  "from-red-600 to-rose-700",
  Warm: "from-amber-600 to-orange-700",
  Cold: "from-blue-600 to-sky-700",
};

/* ─── Metric card definitions ────────────────────────────────────── */
interface CardDef {
  key:    "total" | "hot" | "warm" | "cold";
  label:  string;
  icon:   string;
  color:  string;        // hex accent
  glow:   string;        // rgba glow
  border: string;        // border colour
  bg:     string;        // card bg gradient
  ring:   string;        // icon ring bg
}

const CARDS: CardDef[] = [
  {
    key: "total", label: "Total Leads",   icon: "fas fa-users",
    color: "#a78bfa", glow: "rgba(167,139,250,.18)", border: "rgba(139,92,246,.35)",
    bg:   "linear-gradient(135deg,rgba(30,27,75,.7),rgba(20,18,50,.8))",
    ring: "rgba(139,92,246,.2)",
  },
  {
    key: "hot",   label: "Hot Leads",     icon: "fas fa-fire",
    color: "#f87171", glow: "rgba(248,113,113,.18)", border: "rgba(239,68,68,.35)",
    bg:   "linear-gradient(135deg,rgba(75,20,20,.7),rgba(50,15,15,.8))",
    ring: "rgba(239,68,68,.2)",
  },
  {
    key: "warm",  label: "Warm Leads",    icon: "fas fa-bolt",
    color: "#fbbf24", glow: "rgba(251,191,36,.18)",  border: "rgba(245,158,11,.35)",
    bg:   "linear-gradient(135deg,rgba(75,55,10,.7),rgba(50,35,5,.8))",
    ring: "rgba(245,158,11,.2)",
  },
  {
    key: "cold",  label: "Cold Leads",    icon: "fas fa-snowflake",
    color: "#60a5fa", glow: "rgba(96,165,250,.18)",  border: "rgba(59,130,246,.35)",
    bg:   "linear-gradient(135deg,rgba(15,30,75,.7),rgba(10,20,50,.8))",
    ring: "rgba(59,130,246,.2)",
  },
];

/* ─── Skeleton card ──────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 animate-pulse" style={{ background:"rgba(30,41,59,.6)", border:"1px solid rgba(71,85,105,.3)" }}>
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 mb-3" />
      <div className="h-7 w-14 bg-slate-700/60 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-700/40 rounded" />
    </div>
  );
}

/* ─── 2×2 Metric grid card ───────────────────────────────────────── */
function MetricCard({ def, value, total, loading }: { def: CardDef; value: number; total: number; loading: boolean }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  if (loading) return <SkeletonCard />;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-1.5 transition-transform duration-200 active:scale-95"
      style={{
        background: def.bg,
        border: `1px solid ${def.border}`,
        boxShadow: `0 0 20px ${def.glow}, inset 0 0 16px ${def.glow}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
        style={{ background: def.ring, boxShadow: `0 0 10px ${def.glow}` }}
      >
        <i className={`${def.icon} text-sm`} style={{ color: def.color }} />
      </div>

      {/* Count */}
      <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight">
        {value}
      </div>

      {/* Label */}
      <div className="text-xs font-semibold" style={{ color: def.color, opacity: .85 }}>
        {def.label}
      </div>

      {/* % pill */}
      {def.key !== "total" && (
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full self-start mt-0.5"
          style={{ background: def.ring, color: def.color }}
        >
          {pct}% of total
        </div>
      )}
    </div>
  );
}

/* ─── Mobile lead card (replaces table rows on small screens) ─────── */
function LeadCard({ lead }: { lead: Lead }) {
  const gradient = AVATAR_GRADIENT[lead.tag] ?? "from-slate-600 to-slate-700";
  return (
    <div
      className="rounded-xl p-3.5 flex items-start gap-3"
      style={{ background:"rgba(30,41,59,.5)", border:"1px solid rgba(71,85,105,.3)" }}
    >
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
        {(lead.name || "?").split(" ").slice(0,2).map((n:string) => n[0]).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-semibold text-white text-sm truncate">{lead.name}</span>
          {TAG_BADGE[lead.tag]}
        </div>
        {lead.phone && <div className="text-xs text-slate-400">{lead.phone}</div>}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {lead.bhk   && <span className="text-xs text-slate-500">{lead.bhk}</span>}
          {lead.budget && <span className="text-xs text-slate-500 font-medium">{lead.budget}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Desktop table row ─────────────────────────────────────────────── */
function TableRow({ lead, i }: { lead: Lead; i: number }) {
  const gradient = AVATAR_GRADIENT[lead.tag] ?? "from-slate-600 to-slate-700";
  return (
    <tr className="border-b border-slate-700/30 hover:bg-violet-600/5 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {(lead.name || "?").split(" ").slice(0,2).map((n:string) => n[0]).join("")}
          </div>
          <span className="font-medium text-white text-sm">{lead.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-slate-400 text-sm">{lead.phone}</td>
      <td className="px-4 py-3.5 text-slate-500 text-sm hidden lg:table-cell">{lead.email}</td>
      <td className="px-4 py-3.5 text-slate-300 text-sm font-medium hidden md:table-cell">{lead.bhk}</td>
      <td className="px-4 py-3.5 text-slate-300 text-sm font-medium">{lead.budget}</td>
      <td className="px-4 py-3.5">{TAG_BADGE[lead.tag]}</td>
    </tr>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-b border-slate-700/30">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-slate-700/60 rounded animate-pulse" style={{ width:`${60+i*8}%` }} />
        </td>
      ))}
    </tr>
  );
}

function formatTime(d: Date | null) {
  if (!d) return null;
  return d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit" });
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function Analytics({ leadsState }: Props) {
  const { leads, loading, syncing, error, usingFallback, lastSynced, newCount, reload } = leadsState;
  const stats = useLeadsStats(leadsState);
  const [search, setSearch] = useState("");

  const filtered = leads.filter(l =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
    l.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">Analytics &amp; Leads</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {usingFallback
              ? <span className="text-xs text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">Demo data</span>
              : <span className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Live · {formatTime(lastSynced)}
                </span>
            }
            {syncing && <span className="text-xs text-violet-400 animate-pulse">Syncing…</span>}
            {stats.source === "supabase" && (
              <span className="text-xs text-cyan-400 bg-cyan-900/20 border border-cyan-800/40 px-2 py-0.5 rounded-full font-medium">Supabase DB</span>
            )}
          </div>
        </div>
        <button
          onClick={() => reload()}
          disabled={loading || syncing}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-40"
        >
          <i className={`fas fa-rotate-right text-sm ${(loading || syncing) ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── New leads banner ──────────────────────────────────── */}
      {newCount > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-violet-900/20 border border-violet-700/50 px-4 py-2.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
          <span className="text-sm text-violet-300 font-semibold">🎉 {newCount} new lead{newCount > 1 ? "s" : ""} from n8n!</span>
        </div>
      )}

      {/* ── Error banner ──────────────────────────────────────── */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-amber-900/20 border border-amber-800/50 text-amber-400 text-xs px-4 py-2.5 rounded-xl">
          <i className="fas fa-triangle-exclamation shrink-0" /> {error}
        </div>
      )}

      {/* ── 2×2 Metric Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {CARDS.map(card => (
          <MetricCard
            key={card.key}
            def={card}
            value={stats[card.key]}
            total={stats.total}
            loading={stats.loading}
          />
        ))}
      </div>

      {/* ── Lead Tracker ──────────────────────────────────────── */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Table header */}
        <div className="px-4 py-3.5 border-b border-slate-700/50 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white flex items-center gap-2">
              Live Lead Tracker
              {syncing && <span className="text-xs text-violet-400 font-normal animate-pulse">· refreshing…</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">auto-refreshes every 30s · Rohan AI qualified</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 flex-1 min-w-0 max-w-xs">
            <i className="fas fa-search text-slate-500 text-xs shrink-0" />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full min-w-0"
            />
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="md:hidden p-3 space-y-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl p-3.5 animate-pulse" style={{ background:"rgba(30,41,59,.5)", border:"1px solid rgba(71,85,105,.3)" }}>
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-700/60 shrink-0" />
                    <div className="flex-1 space-y-2 pt-0.5">
                      <div className="h-3.5 bg-slate-700/60 rounded w-2/3" />
                      <div className="h-3 bg-slate-700/40 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))
            : filtered.length === 0
              ? <div className="text-center py-8 text-slate-500 text-sm">No leads match your search.</div>
              : filtered.map((l: Lead, i: number) => <LeadCard key={l.id ?? i} lead={l} />)
          }
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                {["Lead Name", "Phone", "Email", "BHK", "Budget", "AI Tag"].map(h => (
                  <th key={h} className="text-left text-xs text-slate-500 uppercase tracking-wider px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} />)
                : filtered.map((l: Lead, i: number) => <TableRow key={l.id ?? i} lead={l} i={i} />)
              }
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            <span className="text-slate-300 font-semibold">{filtered.length}</span> / {leads.length} leads
          </span>
          <div className="flex items-center gap-1">
            <button className="text-xs text-white bg-violet-600 px-3 py-1.5 rounded-lg">1</button>
            <button className="text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
