"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";

interface ChatbotProps {
  // contextType: "marketplace" | "product" | "dashboard";
  contextType: "marketplace" | "product";
  produceId?: string;
  contextData?: any; // This can be used to pass specific data context for the chatbot
}

export default function Chatbot({ contextType, contextData }: ChatbotProps) {
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

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    console.log("Chatbot contextType:", contextType);
  }, [contextType]);

  useEffect(() => {
    console.log("Chatbot contextData:", contextData);
  }, [contextData]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const newMessage = [...messages, userMsg];

    try {
      // console.log("SENDING CONTEXT:", {
      //   type: contextType,
      //   data: contextData,
      // });

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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-emerald-600 cursor-pointer text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={22} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
            <Bot size={20} />{" "}
            <span className="font-bold text-sm tracking-widest uppercase">
              AgroAI
            </span>
          </div>

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
                {/* <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm"> */}
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                </div>
                {/* </div> */}
              </div>
            )}
          </div>

          <div className="p-3 flex gap-2 border-t border-slate-100 dark:border-slate-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-xs outline-none"
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
