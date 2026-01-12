"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function ProfileDropdown({ user }: { user: any }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Standard manual "Click Outside" logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center cursor-pointer gap-3 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
          <User className="w-5 h-5" />
        </div>

        {/* Shows Username if available, otherwise "User" */}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block">
          {session?.user?.username || session?.user?.name || "User"}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            profileOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {profileOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Header showing Full Name */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
            <p className="text-xs text-slate-400 font-medium">Signed in as</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate">
              {session?.user?.name}
            </p>
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 transition-colors"
          >
            <User className="w-4 h-4" />
            Profile Settings
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login/farmer" })}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
