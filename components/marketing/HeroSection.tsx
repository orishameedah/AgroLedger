"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RoleSelectionModal } from "./RoleSeclectionModal";
import { useState } from "react";

export function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="relative min-h-[90vh] flex-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-green-950/80 via-black/60 to-emerald-950/90 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        {/* Framer motion stuff here */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Securing Nigeria's Harvest through{" "}
            <span className="text-green-400">Blockchain Transparency</span>
          </h1>

          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            AgroLedger connects farmers directly to buyers, eliminating
            middlemen and ensuring fair prices with immutable records.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="bg-white/10 cursor-pointer hover:bg-green-700 text-white border-2 border-white font-bold py-4 px-10 rounded-full transition-all hover:scale-105 w-full sm:w-auto text-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started
            </button>
          </div>
          <RoleSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </motion.div>
      </div>
    </section>
  );
}
