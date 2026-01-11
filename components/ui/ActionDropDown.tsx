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
  status?: string; // This will receive the blockchainStatus
  onClose: () => void;
  isMobile?: boolean;
  actions: ActionItem[];
}

export function ActionDropdown({
  status, // This is your 'item.blockchainStatus'
  onClose,
  isMobile,
  actions,
}: ActionDropdownProps) {
  // Mapping logic using 'blockchainStatus' values
  const statusConfig = status
    ? {
        published: {
          color: "text-emerald-500",
          icon: CheckCircle2, // Using Shield for blockchain items
          label: "Published",
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
      }[status.toLowerCase() as "published" | "processing" | "none"] || {
        color: "text-slate-400",
        icon: XCircle,
        label: "Draft",
      }
    : null;

  return (
    <div
      className={`cursor-pointer absolute right-0 z-100 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ${
        isMobile ? "top-12" : "top-10"
      }`}
    >
      {/* 1. Conditional Status Header */}
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

      {/* 2. Dynamic Actions Mapping */}
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isDanger = action.variant === "danger";
        const isSuccess = action.variant === "success";

        return (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={`cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
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
  );
}
