"use client";
import React from "react";
import type { LeadsState } from "@/hooks/useLeads";

export type TabId = "analytics" | "scheduler" | "chat" | "settings";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOpen: boolean;
  onClose: () => void;
  badges?: Partial<Record<TabId, number>>;
  leadsState: LeadsState;
}

const navItems: { id: TabId; icon: string; label: string; sub: string }[] = [
  { id: "analytics", icon: "fas fa-chart-line",     label: "Analytics & Leads",    sub: "Rohan AI leads"      },
  { id: "scheduler", icon: "fas fa-calendar-check",  label: "Site Visit Scheduler", sub: "Upcoming visits"     },
  { id: "chat",      icon: "fab fa-whatsapp",        label: "WhatsApp Chat Logs",   sub: "5 active sessions"   },
  { id: "settings",  icon: "fas fa-gear",            label: "Bot Settings",         sub: "Configure Rohan AI"  },
];

const iconBg: Record<TabId, string>    = { analytics: "bg-violet-900/50", scheduler: "bg-cyan-900/30", chat: "bg-emerald-900/30", settings: "bg-orange-900/30" };
const iconColor: Record<TabId, string> = { analytics: "text-violet-400",  scheduler: "text-cyan-400",  chat: "text-emerald-400",  settings: "text-orange-400"  };

function SyncDot({ syncing }: { syncing: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full transition-colors ${syncing ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`}
      title={syncing ? "Syncing…" : "Live"}
    />
  );
}

function formatTime(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose, badges = {}, leadsState }: SidebarProps) {
  const { lastSynced, syncing, usingFallback, leads } = leadsState;

  return (
    <>
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={onClose} />
      )}

      <aside className={`
        w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen overflow-y-auto shrink-0
        fixed md:sticky top-0 z-40 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shadow-lg" style={{ boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}>
              <i className="fas fa-crown text-white text-sm" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">Digital Godfather</div>
              <div className="text-xs text-violet-400 font-medium">AI Real Estate Platform</div>
            </div>
          </div>
        </div>

        {/* Live sync status */}
        <div className="px-4 pt-3 pb-2 mx-3 mt-3 rounded-xl bg-slate-800 border border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <SyncDot syncing={syncing} />
              <span className="text-xs font-semibold" style={{ color: usingFallback ? "#f59e0b" : "#34d399" }}>
                {usingFallback ? "Demo Mode" : syncing ? "Syncing n8n…" : "Live — n8n connected"}
              </span>
            </div>
            {!usingFallback && (
              <span className="text-xs text-emerald-500 font-bold bg-emerald-900/30 px-1.5 py-0.5 rounded-full">LIVE</span>
            )}
          </div>
          <div className="text-xs text-slate-600">
            {leads.length} leads · Last sync {formatTime(lastSynced)}
          </div>
          {/* Live progress bar that fills/resets every 30s */}
          <SyncProgressBar syncing={syncing} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-3 mb-2">Main Menu</div>
          {navItems.map(item => {
            const active = activeTab === item.id;
            const badge  = badges[item.id];
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); onClose(); }}
                className={`
                  w-full text-left rounded-lg px-3 py-3 flex items-center gap-3 transition-all border-l-[3px]
                  ${active ? "bg-violet-600/15 border-violet-500 text-violet-300" : "border-transparent text-slate-300 hover:bg-violet-600/8"}
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg[item.id]}`}>
                  <i className={`${item.icon} ${iconColor[item.id]} text-sm`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-slate-500">
                    {item.id === "analytics" ? `${leads.length} leads` : item.sub}
                  </div>
                </div>
                {/* New-data notification badge */}
                {badge ? (
                  <span
                    className="bg-violet-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold px-1 animate-bounce"
                    style={{ boxShadow: "0 0 8px rgba(139,92,246,.6)" }}
                  >
                    +{badge}
                  </span>
                ) : item.id === "chat" ? (
                  <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">5</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Broker profile */}
        <div className="px-3 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">RK</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">Rajesh Kumar</div>
              <div className="text-xs text-slate-500 truncate">Broker · Panvel</div>
            </div>
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <i className="fas fa-ellipsis-vertical text-sm" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// 30-second countdown bar that resets on each sync
function SyncProgressBar({ syncing }: { syncing: boolean }) {
  const [pct, setPct] = React.useState(100);

  React.useEffect(() => {
    setPct(100);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / 30000) * 100);
      setPct(remaining);
      if (remaining > 0) raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [syncing]);

  return (
    <div className="mt-2 h-0.5 bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-none"
        style={{
          width: `${pct}%`,
          background: syncing ? "#f59e0b" : "linear-gradient(90deg,#8b5cf6,#34d399)",
        }}
      />
    </div>
  );
}
