"use client";

import {
  Plus,
  ShoppingBag,
  Package,
  TrendingUp,
  LayoutGrid,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  getDashboardStats,
  // getRecentActivities,
} from "@/lib/actions/produce.actions";
import { getRecentActivities } from "../../lib/actions/sales.actions";
import { getTotalSales } from "@/lib/actions/sales.actions";
import { useState, useEffect } from "react";

export const HomeDashboard = () => {
  const { data: session } = useSession(); // 2. Fetch the session here
  const user = session?.user;
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalItems: 0,
    activeListings: 0,
    totalSales: 0, // This will hold our calculated revenue
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (session?.user?.id) {
        const [statsData, activityData, salesData] = await Promise.all([
          getDashboardStats(session.user.id),
          getRecentActivities(session.user.id),
          getTotalSales(session.user.id),
        ]);

        setStats({
          ...statsData,
          totalSales: salesData.totalSales,
        });
        setActivities(activityData);
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [session]);

  // Currency Formatter Helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(value);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. HERO SECTION & ACTION BUTTONS */}
      <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-sm font-medium text-emerald-400 mb-2">
            Friday, 9th Jan, 2026
          </h2>
          <h1 className="text-3xl md:text-4xl text-amber-100 font-bold mb-6">
            Welcome back, {user?.name || "Farmer"}! 👋
          </h1>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/produce"
              className="flex items-center gap-2 bg-white text-emerald-900 px-5 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Farm Produce
            </Link>
            <Link
              href="/sales"
              className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all border border-emerald-500/30"
            >
              <TrendingUp className="w-5 h-5" />
              Add New Sales
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 bg-transparent text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/20"
            >
              <ShoppingBag className="w-5 h-5" />
              Go to Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Produce Value */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-blue-100 dark:bg-blue-900/30 text-blue-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Total Produce Price</p>
          <h3 className="stats-card-value">
            {loading ? "..." : formatCurrency(stats.totalValue)}
          </h3>
        </div>

        {/* Active Marketplace Listings */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-purple-100 dark:bg-purple-900/30 text-purple-600">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Active Listings</p>
          <h3 className="stats-card-value">
            {loading ? "..." : stats.activeListings}
          </h3>
        </div>

        {/* Total Profit */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Total Sales</p>
          <h3 className="stats-card-value">
            {loading ? "..." : formatCurrency(stats.totalSales)}
          </h3>
        </div>

        {/* Total Inventory Items */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-amber-100 dark:bg-amber-900/30 text-amber-600">
            <Package className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Produce Inventory</p>
          <h3 className="stats-card-value">
            {loading ? "..." : stats.totalItems.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* 3. RECENT ACTIVITIES SECTION - Now Dynamic */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header code stays same */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            RecentActivities
          </h3>
        </div>

        {/* Desktop view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            {/* Thead code stays same */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400">
                    Loading activities...
                  </td>
                </tr>
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {activity.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {activity.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                        {activity.type === "Sale" ? "Sales" : "Product"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400">
                    No recent activity found. Add some produce to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        {/* MOBILE LIST - Shown only on small screens (below 640px) */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500">{activity.name}</p>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-blue-100 text-blue-600">
                  {activity.type === "Sale" ? "Sales" : "Product"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>{activity.date}</span>
                <span className="text-emerald-600 font-bold">Produce</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
