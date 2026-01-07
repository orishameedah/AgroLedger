"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { SuccessMessage } from "../ui/SuccessMessage";

import { FARM_TYPES, NIGERIAN_STATES, DAYS_OF_WEEK } from "@/lib/constants";

export const FarmerSetupForm = ({ user }: { user: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectionError, setSelectionError] = useState({
    field: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    phoneNumber: "",
    farmName: "",
    farmTypes: [] as string[],
    locations: [] as string[],
    startTime: "08:00",
    endTime: "17:00",
    // CHANGED: Starting with an empty array so users select their days
    availableDays: [] as string[],
  });

  const visibleLocations = showAllLocations
    ? NIGERIAN_STATES
    : NIGERIAN_STATES.slice(0, 15);

  const toggleSelection = (
    list: "farmTypes" | "locations" | "availableDays",
    item: string
  ) => {
    // Clear error whenever they click something
    setSelectionError({ field: "", message: "" });

    setFormData((prev) => {
      const currentList = prev[list];

      // If item exists, remove it (always allowed)
      if (currentList.includes(item)) {
        return { ...prev, [list]: currentList.filter((i) => i !== item) };
      }

      // Limit check for farmTypes and locations
      if (list !== "availableDays" && currentList.length >= 5) {
        setSelectionError({
          field: list,
          message: "Maximum of 5 selections allowed for this section.",
        });
        return prev; // Do nothing
      }

      // Add item if within limits or if it's "availableDays"
      return { ...prev, [list]: [...currentList, item] };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Safety check: Ensure at least one day is selected
    if (formData.availableDays.length === 0) {
      alert("Please select at least one available day.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/farmer-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/farmer-dashboard");
      }, 3000);
      setLoading(false);
    }
  };

  const SectionHeader = ({
    number,
    title,
  }: {
    number: number;
    title: string;
  }) => (
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
        {number}
      </span>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
  );

  return (
    <>
      <SuccessMessage
        isVisible={showSuccess}
        message="Farm Setup Successfully! Redirecting to dashboard..."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-2xl space-y-10 my-10"
      >
        <header className="border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            FarmBusiness Setup
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back,{" "}
            <span className="text-green-700 font-semibold">{user.name}</span>.
            Let's complete your profile.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. CONTACT DETAILS */}
          <section className="space-y-4">
            <SectionHeader number={1} title="Contact Details" />
            <input
              required
              type="tel"
              placeholder="Phone Number (WhatsApp preferred)"
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-green-600 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
            />
          </section>

          {/* 2. FARM NAME */}
          <section className="space-y-4">
            <SectionHeader number={2} title="Farm Name" />
            <input
              required
              placeholder="Business or Farm Name (e.g., Wazico Farms)"
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-green-600 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, farmName: e.target.value })
              }
            />
          </section>

          {/* 3. FARM TYPES */}
          <section className="space-y-4">
            <SectionHeader number={3} title="Farm Types" />
            <p className="text-xs text-slate-400 font-medium italic">
              Select up to 5 categories
            </p>
            <div className="flex flex-wrap gap-2">
              {FARM_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSelection("farmTypes", type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all border ${
                    formData.farmTypes.includes(type)
                      ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                      : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {selectionError.field === "farmTypes" && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold"
              >
                {selectionError.message}
              </motion.p>
            )}
          </section>

          {/* 4. FARM LOCATION */}
          <section className="space-y-4">
            <SectionHeader number={4} title="Farm Location" />
            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {visibleLocations.map((state) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={state}
                    type="button"
                    onClick={() => toggleSelection("locations", state)}
                    className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                      formData.locations.includes(state)
                        ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
                    }`}
                  >
                    {state}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            {!showAllLocations ? (
              <button
                type="button"
                onClick={() => setShowAllLocations(true)}
                className="flex items-center gap-2 text-sm font-bold text-green-700 mt-2"
              >
                <ChevronDown size={18} /> See more
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAllLocations(false)}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 mt-2"
              >
                <ChevronUp size={18} /> Show fewer
              </button>
            )}
            {selectionError.field === "locations" && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold"
              >
                {selectionError.message}
              </motion.p>
            )}
          </section>

          {/* 5. AVAILABILITY */}
          <section className="space-y-4">
            <SectionHeader number={5} title="Availability" />
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <CalendarDays size={16} /> Select the days you are available to
                fulfill orders
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleSelection("availableDays", day)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                      formData.availableDays.includes(day)
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">
                  Start Calling Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  className="w-full p-4 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-green-600 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">
                  End Calling Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  className="w-full p-4 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-green-600 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-100">
            <button
              disabled={
                loading ||
                formData.farmTypes.length === 0 ||
                formData.locations.length === 0 ||
                formData.availableDays.length === 0
              }
              className="w-full py-5 cursor-pointer bg-green-700 hover:bg-green-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Complete Setup"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};
