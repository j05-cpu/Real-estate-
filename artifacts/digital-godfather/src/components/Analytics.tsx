"use client";
import React, { useState } from "react";
import type { LeadsState } from "@/hooks/useLeads";
import type { Lead } from "@/lib/api";

interface Props { leadsState: LeadsState; }

const TAG_BADGE: Record<string, React.ReactNode> = {
  Hot:  <span style={{ background:"rgba(239,68,68,.15)", border:"1px solid rgba(239,68,68,.5)", color:"#ef4444", boxShadow:"0 0 10px rgba(239,68,68,.35)" }} className="text-xs px-2.5 py-0.5 rounded-full font-bold inline-block animate-pulse">🔥 Hot</span>,
  Warm: <span style={{ background:"rgba(245,158,11,.15)", border:"1px solid rgba(245,158,11,.5)", color:"#f59e0b", boxShadow:"0 0 8px rgba(245,158,11,.3)" }} className="text-xs px-2.5 py-0.5 rounded-full font-bold inline-block">⚡ Warm</span>,
  Cold: <span style={{ background:"rgba(59,130,246,.15)", border:"1px solid rgba(59,130,246,.5)", color:"#3b82f6", boxShadow:"0 0 8px rgba(59,130,246,.2)" }} className="text-xs px-2.5 py-0.5 rounded-full font-bold inline-block">❄️ Cold</span>,
};

const AVATAR_GRADIENT: Record<string, string> = {
  Hot:  "from-red-600 to-rose-700",
  Warm: "from-amber-600 to-orange-700",
  Cold: "from-blue-600 to-sky-700",
};

function MetricCard({ icon, iconBg, iconGlow, title, value, change, bar, barColor, sub }: {
  icon: string; iconBg: string; iconGlow: string; title: string; value: string;
  change: string; bar: number; barColor: string; sub: string;
}) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-5 backdrop-blur-sm" style={{ border:`1px solid ${iconGlow}44`, boxShadow:`0 0 20px ${iconGlow}26, inset 0 0 20px ${iconGlow}0d` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background:iconBg, boxShadow:`0 0 14px ${iconGlow}4d` }}>
          <i className={`${icon} text-lg`} style={{ color:iconGlow }} />
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded-full font-medium">{change}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{title}</div>
      <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width:`${bar}%`, background:barColor }} />
      </div>
      <div className="text-xs text-slate-600 mt-1">{sub}</div>
    </div>
  );
}

function SkeletonRow() {
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

export default function Analytics({ leadsState }: Props) {
  const { leads, loading, syncing, error, usingFallback, lastSynced, newCount, reload } = leadsState;
  const [search, setSearch] = useState("");

  const filtered = leads.filter(l =>
    !search ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.tag.toLowerCase().includes(search.toLowerCase())
  );

  const hotCount  = leads.filter(l => l.tag === "Hot").length;
  const warmCount = leads.filter(l => l.tag === "Warm").length;
  const coldCount = leads.length - hotCount - warmCount;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Analytics &amp; Leads</h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-sm text-slate-500">Monday, 23 June 2026 · Panvel</p>
            {/* Live / demo status pill */}
            {usingFallback
              ? <span className="text-xs text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2 py-0.5 rounded-full font-medium">Demo data</span>
              : <span className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live · {formatTime(lastSynced)}
                </span>
            }
            {syncing && <span className="text-xs text-violet-400 animate-pulse">Syncing…</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => reload()} disabled={loading || syncing} className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-2 rounded-xl transition-colors disabled:opacity-50">
            <i className={`fas fa-rotate-right text-xs ${(loading || syncing) ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button className="hidden md:flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors" style={{ boxShadow:"0 0 16px rgba(139,92,246,.3)" }}>
            <i className="fas fa-download text-xs" /> Export
          </button>
        </div>
      </div>

      {/* New leads notification */}
      {newCount > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-violet-900/20 border border-violet-700/50 px-4 py-3 rounded-xl" style={{ boxShadow:"0 0 16px rgba(139,92,246,.15)" }}>
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-sm text-violet-300 font-semibold">🎉 {newCount} new lead{newCount>1?"s":""} just arrived from n8n!</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-amber-900/20 border border-amber-800/50 text-amber-400 text-xs px-4 py-2.5 rounded-xl">
          <i className="fas fa-triangle-exclamation" /> {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <MetricCard icon="fas fa-robot"        iconBg="rgba(139,92,246,.2)"  iconGlow="#8b5cf6" title="Total AI Chats"        value="3,847"              change="+18% ↑" bar={76} barColor="linear-gradient(90deg,#7c3aed,#a78bfa)" sub="76% engagement rate" />
        <MetricCard icon="fas fa-location-dot" iconBg="rgba(6,182,212,.15)"  iconGlow="#06b6d4" title="Confirmed Site Visits"  value={String(leads.filter(l=>l.tag!=="Cold").length || 214)} change="+32% ↑" bar={59} barColor="linear-gradient(90deg,#0891b2,#67e8f9)" sub="59% conversion rate" />
        <MetricCard icon="fas fa-envelope"     iconBg="rgba(16,185,129,.15)" iconGlow="#10b981" title="Emails Sent"            value="9,128"              change="+24% ↑" bar={88} barColor="linear-gradient(90deg,#059669,#6ee7b7)" sub="88% delivery rate" />
      </div>

      {/* Lead breakdown pills */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs text-slate-500 font-medium">Lead breakdown:</span>
        <span className="text-xs text-red-400   bg-red-900/20   border border-red-800/40   px-2.5 py-1 rounded-full font-semibold">{hotCount}  Hot</span>
        <span className="text-xs text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2.5 py-1 rounded-full font-semibold">{warmCount} Warm</span>
        <span className="text-xs text-blue-400  bg-blue-900/20  border border-blue-800/40  px-2.5 py-1 rounded-full font-semibold">{coldCount} Cold</span>
        <span className="text-xs text-slate-500 ml-auto">{leads.length} total</span>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Live Lead Tracker
              {syncing && <span className="text-xs text-violet-400 font-normal animate-pulse">· refreshing…</span>}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Rohan AI-qualified · auto-refreshes every 30s</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <i className="fas fa-search text-slate-500 text-xs" />
            <input type="text" placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-28 md:w-40" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                {["Lead Name","Phone","Email","BHK","Budget","AI Tag"].map(h => (
                  <th key={h} className="text-left text-xs text-slate-500 uppercase tracking-wider px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({length:5}).map((_,i) => <SkeletonRow key={i} />)
                : filtered.map((l: Lead, i: number) => (
                    <tr key={l.id ?? i} className="border-b border-slate-700/30 hover:bg-violet-600/5 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_GRADIENT[l.tag]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                            {l.name.split(" ").slice(0,2).map(n=>n[0]).join("")}
                          </div>
                          <span className="font-medium text-white">{l.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">{l.phone}</td>
                      <td className="px-4 py-3.5 text-slate-500">{l.email}</td>
                      <td className="px-4 py-3.5 text-slate-300 font-medium">{l.bhk}</td>
                      <td className="px-4 py-3.5 text-slate-300 font-medium">{l.budget}</td>
                      <td className="px-4 py-3.5">{TAG_BADGE[l.tag]}</td>
                    </tr>
                  ))
              }
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">No leads match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> of {leads.length} leads</span>
          <div className="flex items-center gap-1">
            <button className="text-xs text-white bg-violet-600 px-3 py-1.5 rounded-lg">1</button>
            <button className="text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">2</button>
            <button className="text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
