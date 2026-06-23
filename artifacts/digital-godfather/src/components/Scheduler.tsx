"use client";
import React from "react";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment } from "@/lib/api";

const TAG_STYLE: Record<string, { badge: string; dot: string; date: string }> = {
  Hot:  { badge: "bg-red-900/20 border-red-700/60 text-red-400", dot: "bg-violet-900/40 border-violet-700/50 text-violet-400", date: "JUN" },
  Warm: { badge: "bg-amber-900/20 border-amber-700/60 text-amber-400", dot: "bg-cyan-900/40 border-cyan-700/50 text-cyan-400", date: "JUN" },
  Cold: { badge: "bg-blue-900/20 border-blue-700/60 text-blue-400", dot: "bg-slate-700/40 border-slate-600/50 text-slate-400", date: "JUN" },
};

const STATUS_STYLE: Record<string, string> = {
  "Confirmed":   "text-emerald-400",
  "Pending":     "text-amber-400",
  "Email Sent":  "text-blue-400",
};
const STATUS_ICON: Record<string, string> = {
  "Confirmed":  "fas fa-circle-check",
  "Pending":    "fas fa-clock",
  "Email Sent": "fas fa-envelope",
};

function extractDay(dateStr: string): string {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : String(d.getDate()).padStart(2,"0");
}
function extractDayName(dateStr: string): string {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const today = new Date("2026-06-23");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return days[d.getDay()];
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 bg-slate-800/40 border border-slate-700/30 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-700/60" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700/60 rounded w-1/3" />
          <div className="h-3 bg-slate-700/40 rounded w-2/3" />
          <div className="h-3 bg-slate-700/40 rounded w-1/2" />
        </div>
        <div className="w-20 h-14 bg-slate-700/60 rounded-xl" />
      </div>
    </div>
  );
}

export default function Scheduler() {
  const { appointments, loading, error, usingFallback, reload } = useAppointments();

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Site Visit Scheduler</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Panvel Project — June 2026
            {usingFallback && <span className="ml-2 text-amber-400 text-xs">(demo data)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <i className={`fas fa-rotate-right text-xs ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors" style={{ boxShadow:"0 0 16px rgba(6,182,212,.25)" }}>
            <i className="fas fa-plus text-xs" /> New Slot
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-amber-900/20 border border-amber-800/50 text-amber-400 text-xs px-4 py-2.5 rounded-xl">
          <i className="fas fa-triangle-exclamation" /> {error}
        </div>
      )}

      {/* Mini calendar */}
      <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-4 md:p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <button className="text-slate-400 hover:text-white w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors">
            <i className="fas fa-chevron-left text-xs" />
          </button>
          <div className="text-sm font-semibold text-white">June 23 – 29, 2026</div>
          <button className="text-slate-400 hover:text-white w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors">
            <i className="fas fa-chevron-right text-xs" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} className="text-center text-xs text-slate-500 font-semibold py-1">{d}</div>
          ))}
          {[
            { day:23, dots:["bg-violet-400","bg-violet-400"], today:true },
            { day:24, dots:["bg-cyan-400"],    today:false },
            { day:25, dots:[],                 today:false },
            { day:26, dots:["bg-emerald-400","bg-emerald-400","bg-emerald-400"], today:false },
            { day:27, dots:["bg-amber-400"],   today:false },
            { day:28, dots:["bg-cyan-400","bg-cyan-400"], today:false },
            { day:29, dots:[],                 today:false },
          ].map(({ day, dots, today }) => (
            <div
              key={day}
              className="text-center py-2 rounded-lg cursor-pointer transition-colors"
              style={today ? { background:"rgba(139,92,246,.25)", border:"1px solid rgba(139,92,246,.5)" } : { background:"rgba(51,65,85,.3)" }}
            >
              <div className={`text-sm font-${today?"bold":"normal"} ${today?"text-white":"text-slate-300"}`}>{day}</div>
              {dots.length > 0 && (
                <div className="flex justify-center mt-1 gap-0.5">
                  {dots.map((c,i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${c}`} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {[["bg-violet-400","Today"],["bg-cyan-400","Site Visit"],["bg-emerald-400","Confirmed"],["bg-amber-400","Pending"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className={`w-2 h-2 rounded-full ${c}`} />  {l}
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold text-white mb-3">Upcoming Site Visits</h2>

      <div className="space-y-3">
        {loading
          ? Array.from({length:4}).map((_,i) => <SkeletonCard key={i} />)
          : appointments.map((apt: Appointment, i: number) => {
              const style = TAG_STYLE[apt.tag] ?? TAG_STYLE.Cold;
              return (
                <div
                  key={apt.id ?? i}
                  className="rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background:"linear-gradient(135deg,#1e293b,#1a2235)", border:"1px solid rgba(71,85,105,.4)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(71,85,105,.4)")}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Date badge */}
                    <div className={`rounded-xl px-3 py-2 text-center min-w-[64px] border ${style.dot}`}>
                      <div className="text-xs font-medium">{style.date}</div>
                      <div className="text-xl font-bold text-white leading-tight">{extractDay(apt.date)}</div>
                      <div className="text-xs text-slate-500">{extractDayName(apt.date)}</div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{apt.buyerName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${style.badge}`}>{apt.tag} Lead</span>
                      </div>
                      <div className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                        <i className="fas fa-location-dot text-xs" style={{ color: apt.tag==="Hot"?"#8b5cf6":apt.tag==="Warm"?"#06b6d4":"#64748b" }} />
                        {apt.location}
                      </div>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {apt.bhk && <span className="text-xs text-slate-500 flex items-center gap-1"><i className="fas fa-home text-slate-600 text-xs" /> {apt.bhk}{apt.budget ? ` · ${apt.budget}` : ""}</span>}
                        {apt.phone && <span className="text-xs text-slate-500 flex items-center gap-1"><i className="fas fa-user text-slate-600 text-xs" /> {apt.phone}</span>}
                      </div>
                    </div>
                    {/* Time + status */}
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-center">
                        <div className="text-sm font-bold text-white">{apt.time}</div>
                        {apt.duration && <div className="text-xs text-slate-500">{apt.duration}</div>}
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-semibold ${STATUS_STYLE[apt.status] ?? "text-slate-400"}`}>
                        <i className={`${STATUS_ICON[apt.status] ?? "fas fa-circle"} text-xs`} />
                        {apt.status}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        }
        {!loading && appointments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <i className="fas fa-calendar-xmark text-3xl mb-3 block" />
            No upcoming site visits found.
          </div>
        )}
      </div>
    </div>
  );
}
