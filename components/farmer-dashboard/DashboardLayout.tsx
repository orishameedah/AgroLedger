"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggleButton } from "../ui/ThemeTogglebtn";
import { ProfileDropdown } from "../ui/ProfileDropDown";
// import LanguageSelector from "../ui/LanguageSelector";

const navItems = [
  { name: "Home", href: "/farmer-dashboard", icon: Home },
  { name: "Farm Produce Record", href: "/produce", icon: FileText },
  { name: "Sales Records", href: "/sales", icon: ShoppingCart },
  { name: "Settings", href: "/settings-farmer", icon: Settings },
];

// Note: 'user' prop comes from the session in your layout.tsx
export function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* --- MANUAL SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static border-r border-emerald-800 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-emerald-800/50">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Agroledger</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                      : "hover:bg-emerald-800/50 text-emerald-100/70 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "group-hover:text-emerald-400"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Logout */}
          <div className="px-4 py-6 border-t border-emerald-800/50">
            <button
              onClick={() => signOut({ callbackUrl: "/login/farmer" })}
              className="flex w-full items-center cursor-pointer gap-3 px-4 py-3 text-emerald-100/70 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- MAIN SECTION --- */}
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* TOPBAR */}
          <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-8 flex items-center justify-between z-30">
            <div className="flex items-center gap-4">
              <button
                className="p-2 lg:hidden text-slate-500 hover:bg-slate-100 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* --- LANGUAGE SELECTOR --- */}
              {/* <LanguageSelector /> */}
              {/* Theme Toggle */}
              <ThemeToggleButton />

              {/* PROFILE DROPDOWN WITH USER NAME */}
              <ProfileDropdown user={user} />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-slate-900 dark:text-slate-100">
              {children}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}
