"use client";
import React, { useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Penthouse"];
const LANGUAGES = [
  { value: "hinglish", label: "Hinglish (Hindi + English)" },
  { value: "hindi",    label: "Hindi only" },
  { value: "english",  label: "English only" },
  { value: "marathi",  label: "Marathi" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-block w-[52px] h-7 cursor-pointer">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{ background: checked ? "#8b5cf6" : "#334155", boxShadow: checked ? "0 0 10px rgba(139,92,246,.4)" : "none" }}
      />
      <span
        className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow"
        style={{ left: checked ? "28px" : "4px" }}
      />
    </label>
  );
}

export default function BotSettings() {
  const { settings, updateField, toggleBhk, save, saving, saveError, saveSuccess } = useSettings();
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") { alert("Please upload a PDF file."); return; }
    setFileName(f.name);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Bot Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure Rohan AI's knowledge base</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <i className="fas fa-circle-check text-xs" /> Auto-save on submit
        </div>
      </div>

      {/* Error / success banners */}
      {saveError && (
        <div className="mb-4 flex items-center gap-2 bg-red-900/20 border border-red-800/50 text-red-400 text-xs px-4 py-2.5 rounded-xl">
          <i className="fas fa-triangle-exclamation" /> {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="mb-4 flex items-center gap-2 bg-emerald-900/20 border border-emerald-800/50 text-emerald-400 text-xs px-4 py-2.5 rounded-xl">
          <i className="fas fa-circle-check" /> Settings saved to n8n successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">

          {/* Project Info */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-building text-violet-400 text-xs" /> Project Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={settings.projectName}
                  onChange={e => updateField("projectName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600"
                  placeholder="e.g. Godfather Heights"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Starting Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₹</span>
                    <input
                      type="text"
                      value={settings.startingPrice}
                      onChange={e => updateField("startingPrice", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600"
                      placeholder="55,00,000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Possession Date</label>
                  <input
                    type="text"
                    value={settings.possessionDate}
                    onChange={e => updateField("possessionDate", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-slate-600"
                    placeholder="December 2027"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Location Details</label>
                <textarea
                  rows={3}
                  value={settings.locationDetails}
                  onChange={e => updateField("locationDetails", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none placeholder-slate-600"
                  placeholder="Enter full location details..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">BHK Configurations</label>
                <div className="flex flex-wrap gap-2">
                  {BHK_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleBhk(opt)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        settings.bhkOptions.includes(opt)
                          ? "bg-violet-600 text-white border-violet-500"
                          : "bg-slate-700 text-slate-400 border-slate-600 hover:border-violet-500/60 hover:text-violet-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Personality */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-robot text-violet-400 text-xs" /> Rohan AI Personality
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">AI Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Friendly","Professional","Aggressive"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => updateField("tone", t)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        settings.tone === t
                          ? "bg-violet-600 text-white border-violet-500"
                          : "bg-slate-700 text-slate-400 border-slate-600 hover:border-violet-500/60"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">Response Language</label>
                <select
                  value={settings.language}
                  onChange={e => updateField("language", e.target.value as typeof settings.language)}
                  className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer"
                >
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">AI Greeting Message</label>
                <textarea
                  rows={2}
                  value={settings.greetingMessage}
                  onChange={e => updateField("greetingMessage", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/60 text-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-white">Auto Site Visit Scheduling</div>
                  <div className="text-xs text-slate-500 mt-0.5">AI can book slots without broker approval</div>
                </div>
                <Toggle checked={settings.autoSchedule} onChange={v => updateField("autoSchedule", v)} />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-white">Send Brochure Automatically</div>
                  <div className="text-xs text-slate-500 mt-0.5">Share PDF when lead shows interest</div>
                </div>
                <Toggle checked={settings.autoBrochure} onChange={v => updateField("autoBrochure", v)} />
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60 text-white font-bold text-sm transition-all"
            style={{ boxShadow: "0 4px 20px rgba(139,92,246,.35)" }}
          >
            {saving
              ? <><i className="fas fa-spinner animate-spin mr-2" />Saving to n8n...</>
              : <><i className="fas fa-save mr-2" />Save All Settings</>
            }
          </button>
        </div>

        {/* Right col */}
        <div className="space-y-5">

          {/* Upload */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-file-pdf text-red-400 text-xs" /> Project Brochure PDF
            </h2>

            <div
              onClick={() => !fileName && document.getElementById("pdfInput")?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              className={`rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-2 border-violet-500 bg-violet-600/10 shadow-[0_0_20px_rgba(139,92,246,.2)]"
                  : "border-2 border-dashed border-violet-500/40 hover:border-violet-500 hover:bg-violet-600/8"
              }`}
            >
              <input
                id="pdfInput"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => handleFile(e.target.files?.[0])}
              />

              {fileName ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-900/50 border border-emerald-700/50 flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-file-pdf text-emerald-400 text-2xl" />
                  </div>
                  <div className="text-sm font-semibold text-emerald-400 mb-1 truncate">{fileName}</div>
                  <div className="text-xs text-slate-500 mb-2">Uploaded successfully</div>
                  <button
                    onClick={e => { e.stopPropagation(); setFileName(null); }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <i className="fas fa-trash text-xs mr-1" />Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-cloud-arrow-up text-violet-400 text-2xl" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Drop your PDF here</div>
                  <div className="text-xs text-slate-500 mb-3">or click to browse files</div>
                  <div className="text-xs text-slate-600">PDF only · Max 25 MB</div>
                </>
              )}
            </div>

            {/* Existing brochure */}
            <div className="mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-900/40 border border-red-800/50 flex items-center justify-center">
                <i className="fas fa-file-pdf text-red-400 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">GodFather_Heights_v3.pdf</div>
                <div className="text-xs text-slate-600">4.2 MB · 15 Jun 2026</div>
              </div>
              <button className="text-slate-500 hover:text-slate-300 transition-colors">
                <i className="fas fa-download text-xs" />
              </button>
            </div>
          </div>

          {/* Rohan AI Stats */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-chart-pie text-cyan-400 text-xs" /> Rohan AI Stats Today
            </h2>
            <div className="space-y-3">
              {[
                { label:"Chats handled",    value:124, pct:83, color:"bg-violet-500"  },
                { label:"Visits booked",    value: 18, pct:60, color:"bg-cyan-500"    },
                { label:"Brochures sent",   value: 73, pct:73, color:"bg-emerald-500" },
                { label:"Human takeovers",  value:  6, pct:15, color:"bg-red-500"     },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">{s.label}</span>
                    <span className="text-sm font-bold text-white">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* n8n connection info */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">n8n Webhooks</h2>
            <div className="space-y-2">
              {[
                { label: "Get Leads",       status: "connected" },
                { label: "Get Appointments",status: "connected" },
                { label: "Update Settings", status: "connected" },
              ].map(w => (
                <div key={w.label} className="flex items-center justify-between py-1">
                  <span className="text-xs text-slate-400">{w.label}</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
