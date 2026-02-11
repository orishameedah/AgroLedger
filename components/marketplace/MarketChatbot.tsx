"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function MarketChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! Looking for fresh produce or a specific farmer today?",
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm searching the Agroledger database for that...",
        },
      ]);
    }, 1000);
  };

  return (
    // Main container fixed to bottom right
    <div className="fixed bottom-6 right-6 z-50">
      {/* FLOATING BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 cursor-pointer bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-4xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-emerald-600 p-5 text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Bot size={20} />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-widest">
                Agroledger AI
              </p>
              <p className="text-[10px] text-emerald-100 font-bold opacity-80 uppercase">
                Always Active
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about produce..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
