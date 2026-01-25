"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, LucideIcon } from "lucide-react";

interface ActionItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "danger" | "default" | "success";
}

interface ActionDropdownProps {
  status?: string;
  onClose: () => void;
  isMobile?: boolean;
  actions: ActionItem[];
}

export function ActionDropdown({
  status,
  onClose,
  isMobile,
  actions,
}: ActionDropdownProps) {
  const configs = {
    published: {
      color: "text-emerald-500",
      icon: CheckCircle2,
      label: "Published",
    },
    sync: {
      color: "text-amber-500",
      icon: Clock,
      label: "Update Needed",
    },
    processing: {
      color: "text-blue-500",
      icon: Clock,
      label: "Processing...",
    },
    none: {
      color: "text-slate-400",
      icon: XCircle,
      label: "Not published",
    },
  };

  // This is the magic line that fixes the error
  const statusKey = status?.toLowerCase() as keyof typeof configs;

  const statusConfig = statusKey ? configs[statusKey] : null;
  return (
    <>
      {/* 1. THE SCREEN GUARD: Invisible backdrop to handle "clicking out" */}
      <div
        className="fixed inset-0 z-90 bg-transparent cursor-default"
        onClick={(e) => {
          e.stopPropagation(); // Prevents clicking through to elements below
          onClose();
        }}
      />

      {/* 2. THE DROPDOWN: Higher z-index to stay above the backdrop */}
      <div
        className={`absolute right-0 z-100 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ${
          isMobile ? "top-12" : "top-10"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the menu
      >
        {statusConfig && (
          <div className="px-4 py-2 mb-1 border-b border-slate-50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <statusConfig.icon className={`w-4 h-4 ${statusConfig.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status:{" "}
                <span className={statusConfig.color}>{statusConfig.label}</span>
              </span>
            </div>
          </div>
        )}

        {actions.map((action, index) => {
          const Icon = action.icon;
          const isDanger = action.variant === "danger";
          const isSuccess = action.variant === "success";

          return (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose(); // Still closes once an action is taken
              }}
              className={`flex items-center cursor-pointer gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                isDanger
                  ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  : isSuccess
                    ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
