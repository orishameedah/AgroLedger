"use client";

import React from "react";
import { ThemeToggleButton } from "../ui/ThemeTogglebtn";
import { ProfileDropdown } from "../ui/ProfileDropDown";
import { ThemeProvider } from "next-themes";
import Link from "next/link";

export function MarketplaceLayout({
  children,
  user, // This is coming from your Server Layout
}: {
  children: React.ReactNode;
  user: any;
}) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* --- TOPBAR --- */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/marketplace">
              <h1 className="md:text-xl text-[16px] font-black text-emerald-600 dark:text-emerald-400 cursor-pointer">
                AgroLedger{" "}
                <span className="text-slate-800 dark:text-white font-bold">
                  Marketplace
                </span>
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            <ProfileDropdown user={user} />
          </div>
        </header>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-3 md:p-8">{children} </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
