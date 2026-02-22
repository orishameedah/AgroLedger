"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2, RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";

interface ChatbotProps {
  contextType: "marketplace" | "product" | "dashboard";
  // contextType: "marketplace" | "product";
  produceId?: string;
  contextData?: any; // This can be used to pass specific data context for the chatbot
}

export default function Chatbot({ contextType, contextData }: ChatbotProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to AgroLedger! How can I help you navigate the market today?",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- 1. LOAD HISTORY ON MOUNT ---
  useEffect(() => {
    if (!session?.user?.email) return;

    const storageKey = `agro_chat_${session.user.email}`;
    const savedChat = localStorage.getItem(storageKey);

    if (savedChat) {
      const { history, timestamp } = JSON.parse(savedChat);
      const twelveHours = 12 * 60 * 60 * 1000;
      const now = new Date().getTime();

      // Check if expired
      if (now - timestamp > twelveHours) {
        localStorage.removeItem(storageKey);
      } else {
        setMessages(history);
      }
    }
  }, [session?.user?.email]);

  // --- 2. SAVE HISTORY ON MESSAGE CHANGE ---
  useEffect(() => {
    if (!session?.user?.email || messages.length <= 1) return;

    const storageKey = `agro_chat_${session.user.email}`;
    const chatData = {
      history: messages,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(storageKey, JSON.stringify(chatData));
  }, [messages, session?.user?.email]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const clearHistory = () => {
    if (!session?.user?.email) return;

    const storageKey = `agro_chat_${session.user.email}`;
    localStorage.removeItem(storageKey); // Wipe storage
    setMessages([
      {
        role: "assistant",
        content:
          "Welcome to AgroLedger! How can I help you navigate the market today?",
      },
    ]); // Reset state to only the welcome message
  };

  // useEffect(() => {
  //   console.log("Chatbot contextType:", contextType);
  // }, [contextType]);

  // useEffect(() => {
  //   console.log("Chatbot contextData:", contextData);
  // }, [contextData]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const newMessage = [...messages, userMsg];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessage,
          context: {
            type: contextType,
            data: contextData,
          },
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Kindly, check your network and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pb-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-emerald-600 cursor-pointer text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={22} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
            <Bot size={20} />{" "}
            <span className="font-bold text-sm tracking-widest uppercase">
              AgroAI
            </span>
          </div>

          <button
            onClick={clearHistory}
            title="Clear Chat History"
            className="p-1.5 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer group"
          >
            <RotateCcw
              size={16}
              className="group-active:rotate-180 transition-transform duration-300"
            />
          </button>

          <div
            ref={scrollRef}
            className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs font-bold ${msg.role === "user" ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 flex gap-2 border-t border-slate-100 dark:border-slate-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl px-4 py-2 text-xs outline-none"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-emerald-600 text-white cursor-pointer rounded-xl"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
