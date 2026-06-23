"use client";
import React, { useState } from "react";
import Sidebar, { type TabId } from "@/components/Sidebar";
import Analytics from "@/components/Analytics";
import Scheduler from "@/components/Scheduler";
import ChatLogs from "@/components/ChatLogs";
import BotSettings from "@/components/BotSettings";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center"
        >
          <i className="fas fa-bars text-lg" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center"
            style={{ boxShadow: "0 0 12px rgba(139,92,246,.4)" }}
          >
            <i className="fas fa-crown text-white text-xs" />
          </div>
          <span className="font-bold text-white text-sm">Digital Godfather</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">RK</div>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0 overflow-auto">
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "scheduler" && <Scheduler />}
        {activeTab === "chat"      && <ChatLogs />}
        {activeTab === "settings"  && <BotSettings />}
      </main>
    </div>
  );
}
