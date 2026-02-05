"use client";

import { useState } from "react";
import {
  Search,
  Tag,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  Package,
  SearchX,
} from "lucide-react";
import Link from "next/link";
import { getProduceSyncStatus } from "@/lib/utils/Produce";
import { PRODUCE_CATEGORIES } from "@/lib/constants";
import Image from "next/image";
import { Pagination } from "../ui/Pagination";
import { useEffect } from "react";

export function MarketplaceBuyer({ produceData }: { produceData: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const isMarketplaceEmpty = produceData.length === 0;

  // --- FILTER LOGIC ---
  const filteredProducts = produceData.filter((product) => {
    const verifiedPrice =
      product.lastPublishedSnapshot?.price || product.pricePerUnit;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    // Min and Max Price Logic
    const matchesMinPrice = !minPrice || verifiedPrice >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || verifiedPrice <= parseInt(maxPrice);

    const { isOutOfSync } = getProduceSyncStatus(product);

    const matchesSync =
      syncFilter === "all" ||
      (syncFilter === "verified" ? !isOutOfSync : isOutOfSync);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesSync
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Use currentItems for the display grid
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, syncFilter, minPrice, maxPrice]);

  return (
    <div className="space-y-10">
      {/* --- SEARCH & FILTER SECTION --- */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 2. CATEGORY & STATUS GROUP (Compact for Mobile) */}
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
                Status
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                  className="w-full pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs appearance-none cursor-pointer outline-none"
                  value={syncFilter}
                  onChange={(e) => setSyncFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Price Range (Expands to fill remaining desktop space) */}
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

          {/* 4. Clear Filters */}
          <div className="pb-3 w-full lg:w-auto">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSyncFilter("all");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="w-full lg:w-auto text-[11px] uppercase tracking-tighter cursor-pointer font-black text-emerald-600 hover:text-emerald-500 transition-colors py-3 px-4 lg:py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg text-center"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* --- RESULTS GRID --- */}
      {}
      {filteredProducts.length === 0 ? (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Produce Item Not found in Marketplace
          </h2>
          <p className="text-slate-400 mt-2 max-w-xs">
            We couldn't find anything matching your current filters. Try
            adjusting your search or price range.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setMinPrice("");
              setMaxPrice("");
            }}
            className="mt-3 text-sm font-bold text-emerald-600 cursor-pointer hover:text-emerald-500 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        // GRID
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((item) => {
            const { isOutOfSync } = getProduceSyncStatus(item);

            return (
              <Link
                key={item._id}
                href={`/marketplace/${item._id}`}
                className="group block"
              >
                <div
                  className={`relative rounded-[36px] border-2 p-2 transition-all duration-500 ${
                    isOutOfSync
                      ? "border-amber-100 bg-amber-50/40"
                      : "border-transparent bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl hover:border-emerald-500"
                  }`}
                >
                  {/* IMAGE SECTION */}
                  <div className="relative aspect-4/3 rounded-[28px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* Using Next.js Image component for better performance */}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      // This tells the browser exactly how much space the image takes at different screen sizes
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={false}
                    />

                    {/* TRUST BADGE */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-white flex items-center gap-1.5 shadow-xl backdrop-blur-md ${
                        isOutOfSync ? "bg-amber-500/90" : "bg-emerald-500/90"
                      }`}
                    >
                      {isOutOfSync ? (
                        <AlertCircle size={12} />
                      ) : (
                        <ShieldCheck size={12} />
                      )}
                      {isOutOfSync ? "Pending" : "Verified"}
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-3 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {item.category}
                      </p>
                    </div>

                    {/* BLOCKCHAIN DATA BOX */}
                    <div
                      className={`p-4 rounded-3xl transition-all duration-500 ${
                        isOutOfSync
                          ? "bg-amber-100"
                          : "bg-slate-200/75 dark:bg-slate-800/50"
                      }`}
                    >
                      <p className="text-[9px] uppercase font-black text-slate-600  tracking-tighter">
                        Verified Ledger Price
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-2xl font-black ${isOutOfSync ? "text-amber-700" : "text-emerald-700 dark:text-emerald-400"}`}
                        >
                          ₦
                          {(
                            item.lastPublishedSnapshot?.price ||
                            item.pricePerUnit
                          ).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          /{item.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500">
                        <Package size={14} className="text-slate-500" />
                        <span>
                          {item.lastPublishedSnapshot?.quantity || 0}{" "}
                          {item.unit} in Snapshot
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <div className="flex gap-x-4 justify-center pt-2 border-t border-slate-100 dark:border-slate-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll up on change
          }}
        />
      </div>
    </div>
  );
}
