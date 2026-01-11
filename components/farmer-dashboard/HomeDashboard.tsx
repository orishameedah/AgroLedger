"use client";

import {
  Plus,
  ShoppingBag,
  ArrowRight,
  Package,
  TrendingUp,
  LayoutGrid,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Dummy data for the interface preview
const recentActivities = [
  {
    id: 1,
    type: "Produce",
    name: "Maize",
    action: "Added New Entry",
    date: "Jan 9, 2026",
  },
  {
    id: 2,
    type: "Sales",
    name: "Goat",
    action: "Recorded Sale",
    date: "Jan 8, 2026",
  },
  {
    id: 3,
    type: "Market",
    name: "Tomatoes",
    action: "Published to Market",
    date: "Jan 7, 2026",
  },
];

export const HomeDashboard = () => {
  const { data: session } = useSession(); // 2. Fetch the session here
  const user = session?.user;
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
          <h3 className="stats-card-value">₦2,450,000</h3>
          {/* Logic: db.produce.aggregate([ { $group: { _id: null, total: { $sum: "$totalValue" } } } ]) */}
        </div>

        {/* Active Marketplace Listings */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-purple-100 dark:bg-purple-900/30 text-purple-600">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Active Listings</p>
          <h3 className="stats-card-value">32</h3>
          {/* Logic: db.produce.countDocuments({ blockchainStatus: "published" }) */}
        </div>

        {/* Total Profit */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Total Sales Profit</p>
          <h3 className="stats-card-value">₦320,000</h3>
          {/* Logic: db.sales.aggregate([ { $group: { _id: null, profit: { $sum: "$profitAmount" } } } ]) */}
        </div>

        {/* Total Inventory Items */}
        <div className="stats-card-container">
          <div className="stats-card-icon bg-amber-100 dark:bg-amber-900/30 text-amber-600">
            <Package className="w-6 h-6" />
          </div>
          <p className="stats-card-title">Produce Inventory</p>
          <h3 className="stats-card-value">1,250</h3>
          {/* Logic: db.produce.countDocuments({ userId: user.id }) */}
        </div>
      </div>

      {/* 3. RECENT ACTIVITIES SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Recent Activities
          </h3>
          <button className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {activity.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {activity.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        activity.type === "Produce"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "Sales"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {activity.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Logic: db.activities.find({ userId: user.id }).sort({ createdAt: -1 }).limit(5) */}
        </div>
      </div>
    </div>
  );
};
