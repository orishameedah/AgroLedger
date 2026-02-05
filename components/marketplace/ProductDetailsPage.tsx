"use client";

import Image from "next/image";
import {
  Phone,
  MessageSquare,
  ExternalLink,
  Clock,
  MapPin,
  ShieldCheck,
  Info,
  Package,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatTime, getProduceSyncStatus } from "@/lib/utils/Produce";
import Link from "next/link";

export default function ProductDetailsClient({ produce, farmer }: any) {
  // --- INTERACTION LOGIC ---
  const cleanNumber = farmer.phone.replace(/\D/g, "");
  const formattedNumber = cleanNumber.startsWith("0")
    ? `234${cleanNumber.slice(1)}`
    : cleanNumber.startsWith("234")
      ? cleanNumber
      : `234${cleanNumber}`;

  const handleWhatsApp = () => {
    console.log("Raw Farmer Phone Number:", farmer?.phone);

    if (farmer?.phone) {
      console.log("Formatted for WhatsApp:", formattedNumber);
      const url = `https://wa.me/${formattedNumber}?text=Hello ${encodeURIComponent(farmer.farmName)}, I saw your ${encodeURIComponent(produce.name)} on Agroledger...`;
      window.open(url, "_blank");
    } else {
      toast.error("WhatsApp not registered. Please call the farmer directly.", {
        icon: "📞",
        style: { borderRadius: "15px", background: "#333", color: "#fff" },
      });
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${farmer.phoneNumber}`;
  };

  // --- FORMATTING LOGIC ---
  const formattedLocations = Array.isArray(farmer?.locations)
    ? farmer.locations.join(", ")
    : farmer?.locations;

  const availabilityStart = formatTime(
    farmer?.availability?.startTime || "08:00",
  );
  const availabilityEnd = formatTime(farmer?.availability?.endTime || "17:00");
  const availabilityDays =
    Array.isArray(farmer?.availability?.days) && farmer.availability.days.length
      ? farmer.availability.days.join(", ")
      : "Mon - Fri";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. NAVIGATION BAR (Moved outside the grid to prevent layout scattering) */}
      <div className="flex items-center">
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-all group"
        >
          <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 group-hover:border-emerald-500 shadow-sm transition-colors">
            <ChevronLeft size={18} />
          </div>
          <span className="text-xs uppercase tracking-[0.2em]">
            Back to Marketplace
          </span>
        </Link>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Content (Produce Info & Blockchain Verification) */}
        <div className="lg:col-span-7 space-y-8">
          {/* PRODUCE INFO MAIN CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="relative aspect-video w-full">
              <Image
                src={produce.image || "/placeholder.svg"}
                alt={produce.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>

            <div className="lg:p-8 p-6 space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase leading-tight">
                    {produce.name}
                  </h1>
                  <p className="text-emerald-600 font-bold tracking-[0.2em] text-[10px] uppercase">
                    {produce.category}
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 rounded-3xl border border-emerald-100 dark:border-emerald-800 w-full md:w-auto">
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1 tracking-tighter">
                    Price per {produce.unit}
                  </p>
                  <p className="text-2xl md:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                    ₦{produce.pricePerUnit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-4xl border border-slate-100 dark:border-slate-700">
                  <Package className="w-5 h-5 text-emerald-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Available Stock
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    {produce.quantity} {produce.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCKCHAIN VERIFICATION CARD */}
          {(() => {
            const { isOutOfSync } = getProduceSyncStatus(produce);
            return (
              <div
                className={`rounded-[40px] md:p-8 p-5 shadow-xl relative overflow-hidden border transition-all duration-500 ${
                  isOutOfSync
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {isOutOfSync ? (
                        <AlertCircle className="text-amber-600 w-6 h-6" />
                      ) : (
                        <ShieldCheck className="text-emerald-600 w-6 h-6" />
                      )}
                      <h2
                        className={`md:text-xl text-[19px] font-black uppercase tracking-tight ${
                          isOutOfSync ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        {isOutOfSync ? "Update Pending" : "Blockchain Verified"}
                      </h2>
                    </div>
                    <p
                      className={`text-sm max-w-md font-medium leading-relaxed ${
                        isOutOfSync
                          ? "text-amber-800/80"
                          : "text-emerald-800/80"
                      }`}
                    >
                      {isOutOfSync
                        ? "The farmer has updated this produce locally. The details above may differ from the last blockchain snapshot until a re-sync is performed."
                        : "This record is perfectly synced with the Sepolia Testnet. The price and quantity are cryptographically confirmed by the farmer's signature."}
                    </p>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${produce.transactionHash}`}
                    target="_blank"
                    className={`flex items-center gap-3 transition-all px-6 py-4 rounded-2xl border group font-black text-[11px] uppercase tracking-widest shadow-sm ${
                      isOutOfSync
                        ? "bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-900"
                        : "bg-emerald-100 border-emerald-300 hover:bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    View Ledger Record
                    <ExternalLink
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                </div>
                <div
                  className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                    isOutOfSync ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                ></div>
              </div>
            );
          })()}
        </div>

        {/* RIGHT COLUMN: Farmer Profile & System Audit (Sidebar) */}
        <div className="lg:col-span-5 space-y-6">
          {/* FARMER PROFILE CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] md:p-10 p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-4xl font-black text-emerald-600 uppercase border-4 border-white dark:border-slate-800 shadow-md">
                {farmer?.farmName?.charAt(0) || "F"}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                  {farmer?.farmName}
                </h2>
                <div className="flex items-center justify-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <MapPin size={12} className="text-emerald-500" />
                  {formattedLocations || "Location Pending"}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-4xl border border-slate-100 dark:border-slate-700">
                <Clock className="text-emerald-500" size={28} />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Inquiry Hours
                  </p>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                    {availabilityStart} - {availabilityEnd}
                  </p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase mt-1 tracking-widest">
                    {availabilityDays}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={handleCall}
                className="w-full py-5 flex md:flex-row flex-col cursor-pointer bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs  items-center justify-center md:gap-3 gap-0 hover:shadow-xl transition-all active:scale-95"
              >
                <Phone size={18} /> Call Farmer <span>({farmer.phone})</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full py-5 bg-[#25D366] cursor-pointer text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95"
              >
                <MessageSquare size={18} /> WhatsApp Chat{" "}
                <span>(+{formattedNumber})</span>
              </button>
            </div>
          </div>

          {/* SYSTEM AUDIT CARD */}
          <div className="bg-slate-50 dark:bg-slate-800/20 rounded-4xl p-8 border border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Info size={16} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">
                System Audit
              </h3>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-black uppercase">
                Last Blockchain Sync
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 font-bold">
                {produce.lastSyncedAt
                  ? new Date(produce.lastSyncedAt)
                      .toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(",", " •")
                  : "Pending First Sync"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
