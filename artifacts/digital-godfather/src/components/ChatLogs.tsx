"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "ai" | "user";
  name: string;
  text: string;
  time: string;
}

interface Contact {
  name: string;
  phone: string;
  tag: "Hot" | "Warm" | "Cold";
  unread: number;
  time: string;
  active: boolean;
}

const CONTACTS: Contact[] = [
  { name: "Rahul Gupta",   phone: "+91 77665 54433", tag: "Hot",  unread: 3, time: "Just now",   active: true  },
  { name: "Priya Sharma",  phone: "+91 98765 43210", tag: "Hot",  unread: 0, time: "2 min ago",  active: true  },
  { name: "Amit Verma",    phone: "+91 87654 32109", tag: "Warm", unread: 1, time: "5 min ago",  active: true  },
  { name: "Sunita Nair",   phone: "+91 66554 43322", tag: "Cold", unread: 0, time: "12 min ago", active: false },
  { name: "Vikram Singh",  phone: "+91 55443 32211", tag: "Warm", unread: 2, time: "18 min ago", active: true  },
];

const INITIAL_MESSAGES: Message[] = [
  { sender: "ai",   name: "Rohan AI",    text: "Namaste Rahul ji! 🙏 Main Rohan hoon, Godfather Heights ka assistant. Aap 2 BHK mein interested hain na Panvel mein?",                                                         time: "10:02 AM" },
  { sender: "user", name: "Rahul Gupta", text: "Haan bhai, budget around 60 lakh hai. Kya milega?",                                                                                                                              time: "10:03 AM" },
  { sender: "ai",   name: "Rohan AI",    text: "Bahut achha! Humara 2 BHK ₹55L se start hota hai. 650 sq ft carpet area, East-facing, modular kitchen ke saath. Floor 8 pe bhi available hai — amazing view milta hai! 😊",    time: "10:04 AM" },
  { sender: "user", name: "Rahul Gupta", text: "Site visit possible hai kya is weekend?",                                                                                                                                         time: "10:05 AM" },
  { sender: "ai",   name: "Rohan AI",    text: "Bilkul! Main aapke liye Saturday 10 AM slot book karta hoon — Godfather Heights, Sector 12, Panvel. Confirm karo? Ek brochure bhi bhej raha hoon PDF mein! 📋",                 time: "10:05 AM" },
  { sender: "user", name: "Rahul Gupta", text: "Perfect! Saturday 10 AM confirm.",                                                                                                                                                time: "10:06 AM" },
  { sender: "ai",   name: "Rohan AI",    text: "Done! ✅ Site visit confirmed — Saturday, 28 June, 10:00 AM. Location pin WhatsApp pe share kar diya. Rajesh bhai personally aapka swagat karenge! 🤝",                          time: "10:06 AM" },
];

const TAG_DOT: Record<string, string> = { Hot: "bg-red-400", Warm: "bg-amber-400", Cold: "bg-blue-400" };
const TAG_TEXT: Record<string, string> = { Hot: "text-red-400", Warm: "text-amber-400", Cold: "text-blue-400" };

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const AI_RESPONSES = [
  "Samajh gaya! Main abhi broker Rajesh bhai ko bata raha hoon. Kuch minute mein update milega. 🙏",
  "Bilkul! Aapki details note kar li hain. Kya aap kal site visit ke liye available hain?",
  "Shukriya! Brochure aapko WhatsApp pe abhi bhejta hoon. Koi aur sawaal? 😊",
  "Haan ji, 2 BHK unit Tower C mein bhi available hai — same floor, better view!",
];

export default function ChatLogs() {
  const [activeContact, setActiveContact] = useState(0);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [humanMode, setHumanMode] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const userMsg: Message = { sender: "user", name: "You", text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    if (!humanMode) {
      setAiTyping(true);
      setTimeout(() => {
        const reply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
        setMessages(prev => [...prev, { sender: "ai", name: "Rohan AI", text: reply, time: now() }]);
        setAiTyping(false);
      }, 1200 + Math.random() * 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">WhatsApp Live Chat Logs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Rohan AI is handling all active conversations</p>
        </div>
        <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-900/20 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          5 Active
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex-1 bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden flex min-h-0">
        
        {/* Contact list */}
        <div className="w-56 shrink-0 border-r border-slate-700/50 overflow-y-auto hidden sm:flex flex-col">
          <div className="p-3 border-b border-slate-700/50 shrink-0">
            <div className="flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-2">
              <i className="fas fa-search text-slate-500 text-xs" />
              <input type="text" placeholder="Search chats..." className="bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none flex-1" />
            </div>
          </div>
          <div className="p-2 space-y-1 overflow-y-auto">
            {CONTACTS.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveContact(i)}
                className={`w-full text-left rounded-xl p-3 border transition-all ${
                  activeContact === i
                    ? "bg-violet-600/15 border-violet-500/50 border-l-[3px] border-l-violet-500"
                    : "border-transparent hover:bg-violet-600/8"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    {c.active && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-800 animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{c.name}</span>
                      <span className="text-xs text-slate-600 shrink-0 ml-1">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-slate-500 truncate">{c.phone}</span>
                      {c.unread > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shrink-0 ml-1">{c.unread}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${TAG_DOT[c.tag]}`} />
                      <span className={`text-xs font-medium ${TAG_TEXT[c.tag]}`}>{c.tag}</span>
                      {c.active && <span className="text-xs text-emerald-400 ml-1">· AI Active</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-sm">
                {CONTACTS[activeContact].name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{CONTACTS[activeContact].name}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  {humanMode ? "Human mode — you are in control" : aiTyping ? "Rohan AI is typing..." : "AI Active"}
                </div>
              </div>
            </div>

            {/* Human Takeover Toggle */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white">{humanMode ? "Human Mode" : "AI Mode"}</div>
                <div className="text-xs text-slate-500">{humanMode ? "You are in control" : "Rohan handling"}</div>
              </div>
              <label className="relative inline-block w-[52px] h-7 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={humanMode}
                  onChange={e => setHumanMode(e.target.checked)}
                />
                <span
                  className="absolute inset-0 rounded-full transition-all duration-300"
                  style={{
                    background: humanMode ? "#ef4444" : "#334155",
                    boxShadow: humanMode ? "0 0 12px rgba(239,68,68,.5)" : "none",
                  }}
                />
                <span
                  className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow"
                  style={{ left: humanMode ? "28px" : "4px" }}
                />
              </label>
              <span className="text-base">{humanMode ? "👤" : "🤖"}</span>
            </div>
          </div>

          {/* Human takeover banner */}
          {humanMode && (
            <div className="px-4 py-2 bg-red-900/30 border-b border-red-800/50 text-xs text-red-400 flex items-center gap-2 shrink-0">
              <i className="fas fa-triangle-exclamation" />
              Human takeover active — Rohan AI has paused. You are now in control of this conversation.
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => {
              const isAI = m.sender === "ai";
              return (
                <div key={i} className={`flex ${isAI ? "justify-start" : "justify-end"} items-end gap-2`}>
                  {isAI && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">R</div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`text-xs text-slate-600 mb-1 ${isAI ? "" : "text-right"}`}>{m.name} · {m.time}</div>
                    <div
                      className="px-4 py-2.5 text-sm text-slate-200 leading-relaxed"
                      style={isAI
                        ? { background: "linear-gradient(135deg,#1e293b,#1a2235)", border: "1px solid rgba(139,92,246,.2)", borderRadius: "0 12px 12px 12px" }
                        : { background: "linear-gradient(135deg,#312e81,#1e1b4b)", border: "1px solid rgba(139,92,246,.3)", borderRadius: "12px 0 12px 12px" }
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                  {!isAI && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                      {m.name === "You" ? "YO" : m.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {aiTyping && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">R</div>
                <div className="px-4 py-3 rounded-tr-xl rounded-b-xl" style={{ background:"linear-gradient(135deg,#1e293b,#1a2235)", border:"1px solid rgba(139,92,246,.2)" }}>
                  <div className="flex gap-1 items-center h-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 shrink-0">
            <div className="flex items-center gap-3">
              <button className="text-slate-500 hover:text-slate-300 transition-colors"><i className="fas fa-paperclip text-sm" /></button>
              <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={humanMode ? "Type a message..." : "Type to send as yourself..."}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none flex-1"
                />
                <button className="text-slate-500 hover:text-slate-300 transition-colors"><i className="fas fa-face-smile text-sm" /></button>
              </div>
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white transition-colors"
                style={{ boxShadow:"0 0 12px rgba(16,185,129,.4)" }}
              >
                <i className="fas fa-paper-plane text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
