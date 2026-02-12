"use client";

import React, { useRef } from "react";
import { Search, Tag, DollarSign, ShieldCheck, Camera } from "lucide-react";
import { PRODUCE_CATEGORIES } from "@/lib/constants";
import toast from "react-hot-toast";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  syncFilter: string;
  setSyncFilter: (v: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  onClearAll?: () => void;
  setIsAiLoading: (v: boolean) => void;
};

export function MarketplaceFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  // syncFilter,
  // setSyncFilter,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onClearAll,
  setIsAiLoading,
}: Props) {
  const handleManualSearch = (val: string) => setSearchQuery(val);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAiLoading(true);

    // We'll create this API call next
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/visual-search", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.result) {
        setSearchQuery(data.result.trim()); // Automatically puts "Yam" or "Cow" in the search box
      }
    } catch (err) {
      console.error("Visual Search Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 items-end dark:text-white">
        <div className="w-full lg:w-64 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 dark:text-white tracking-widest ml-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white" />
            <input
              type="text"
              placeholder="Rice, etc..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm outline-none transition-all focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => handleManualSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full lg:w-auto flex-1 grid grid-cols-2 gap-3 space-y-0">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                className="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800  border-none rounded-2xl text-xs appearance-none cursor-pointer outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All</option>
                {PRODUCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              Visual Search
            </label>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl text-xs font-bold hover:bg-emerald-100 transition-all border border-dashed border-emerald-200"
            >
              <Camera size={16} />
              <span>Snap & Search</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-auto lg:flex-none space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
            Price (₦)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative w-full lg:w-36">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="number"
                placeholder="Min"
                className="w-full pl-8 pr-2 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs outline-none"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span className="text-slate-300 font-bold">-</span>
            <div className="relative w-full lg:w-36">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="number"
                placeholder="Max"
                className="w-full pl-8 pr-2 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs outline-none"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="pb-3 w-full lg:w-auto">
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              // setSyncFilter("all");
              setMinPrice("");
              setMaxPrice("");
              onClearAll?.();
            }}
            className="w-full lg:w-auto text-[11px] uppercase tracking-tighter cursor-pointer font-black text-emerald-600 hover:text-emerald-500 transition-colors py-3 px-4 lg:py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg text-center"
          >
            Clear All
          </button>
        </div>
      </div>
    </section>
  );
}
