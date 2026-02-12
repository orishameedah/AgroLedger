"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, AlertCircle, Package, SearchX } from "lucide-react";
import Link from "next/link";
import { getProduceSyncStatus } from "@/lib/utils/Produce";
import Image from "next/image";
import { Pagination } from "../ui/Pagination";
import { produceMap } from "@/lib/constants";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";

export function MarketplaceBuyer({ produceData }: { produceData: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const itemsPerPage = 8;

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const normalizedInput = normalizeText(searchQuery);
  const dictionaryMatch = produceMap[normalizedInput];
  const searchTerms = dictionaryMatch
    ? [normalizedInput, dictionaryMatch]
    : [normalizedInput];

  const filteredProducts = produceData.filter((product) => {
    const verifiedPrice =
      product.lastPublishedSnapshot?.price || product.pricePerUnit;

    const matchesSearch = searchTerms.some((term) =>
      normalizeText(product.name).includes(term),
    );

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

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

  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, syncFilter, minPrice, maxPrice]);

  const shouldShowNotFound =
    searchQuery.trim().length >= 5 && filteredProducts.length === 0;

  return (
    <div className="space-y-10">
      <MarketplaceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        syncFilter={syncFilter}
        setSyncFilter={setSyncFilter}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        setIsAiLoading={setIsAiLoading}
      />

      {isAiLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">
            Gemini AI is identifying your image upload <br /> Kindly hold on....
          </p>
        </div>
      ) : shouldShowNotFound ? (
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
                  <div className="relative aspect-4/3 rounded-[28px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={false}
                    />

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

                  <div className="p-3 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {item.category}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-3xl transition-all duration-500 ${
                        isOutOfSync
                          ? "bg-amber-100"
                          : "bg-slate-200/75 dark:bg-slate-800/50"
                      }`}
                    >
                      <p className="text-[9px] uppercase font-black text-slate-600  tracking-tighter">
                        Verified Ledger Price & Quantity
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-2xl font-black ${isOutOfSync ? "text-amber-700" : "text-emerald-700 dark:text-emerald-400"}`}
                        >
                          ₦
                          {(item.lastPublishedSnapshot?.pricePerUnit).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          /{item.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-500">
                        <Package size={14} className="text-slate-500" />
                        <span>
                          {item.lastPublishedSnapshot?.quantity} {item.unit} in
                          Snapshot
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
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}
