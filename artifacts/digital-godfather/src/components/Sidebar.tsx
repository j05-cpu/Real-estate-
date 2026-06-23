"use client";
import React from "react";

export type TabId = "analytics" | "scheduler" | "chat" | "settings";

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: TabId; icon: string; label: string; sub: string; badge?: number }[] = [
  { id: "analytics",  icon: "fas fa-chart-line",    label: "Analytics & Leads",    sub: "87 leads tracked"    },
  { id: "scheduler",  icon: "fas fa-calendar-check", label: "Site Visit Scheduler", sub: "8 upcoming visits"   },
  { id: "chat",       icon: "fab fa-whatsapp",       label: "WhatsApp Chat Logs",   sub: "5 active sessions", badge: 5 },
  { id: "settings",   icon: "fas fa-gear",           label: "Bot Settings",         sub: "Configure Rohan AI"  },
];

const iconBg: Record<TabId, string> = {
  analytics: "bg-violet-900/50",
  scheduler: "bg-cyan-900/30",
  chat:      "bg-emerald-900/30",
  settings:  "bg-orange-900/30",
};
const iconColor: Record<TabId, string> = {
  analytics: "text-violet-400",
  scheduler: "text-cyan-400",
  chat:      "text-emerald-400",
  settings:  "text-orange-400",
};

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen overflow-y-auto shrink-0
          fixed md:sticky top-0 z-40 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center shadow-lg"
              style={{ boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
            >
              <i className="fas fa-crown text-white text-sm" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">Digital Godfather</div>
              <div className="text-xs text-violet-400 font-medium">AI Real Estate Platform</div>
            </div>
          </div>
        </div>

        {/* AI status */}
        <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-slate-800 border border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Rohan AI — Online</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Processing 12 leads right now</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-5 space-y-1">
          <div className="text-xs text-slate-600 font-semibold uppercase tracking-widest px-3 mb-2">Main Menu</div>
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); onClose(); }}
                className={`
                  w-full text-left rounded-lg px-3 py-3 flex items-center gap-3 transition-all
                  border-l-[3px]
                  ${active
                    ? "bg-violet-600/15 border-violet-500 text-violet-300"
                    : "border-transparent text-slate-300 hover:bg-violet-600/8"}
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg[item.id]}`}>
                  <i className={`${item.icon} ${iconColor[item.id]} text-sm`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.sub}</div>
                </div>
                {item.badge && (
                  <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
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
