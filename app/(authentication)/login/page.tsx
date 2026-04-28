"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/auth/login-form";

export default function GenericLoginPage() {
  const [role, setRole] = useState<"buyer" | "farmer" | null>(null);

  if (role) {
    return (
      <LoginForm
        mainTitle={
          role === "buyer" ? "Agroledger Marketplace" : "Agroledger Dashboard"
        }
        formTitle={
          role === "buyer" ? "Login to Marketplace" : "Login to your dashboard"
        }
        role={role}
      />
    );
  }

  // ROLE SELECTION UI - This shows FIRST
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90 z-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight"
      >
        Welcome to Agroledger
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-20 w-full max-w-lg overflow-hidden rounded-3xl bg-white px-8 md:px-12 py-10 shadow-2xl border border-slate-200"
      >
        <h2 className="text-xl font-semibold text-slate-900 text-center mb-8">
          Select your role to continue
        </h2>

        <div className="space-y-4">
          <button
            onClick={() => setRole("farmer")}
            className="w-full py-4 px-6 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all active:scale-[0.98] cursor-pointer text-lg"
          >
            I'm a Farmer
          </button>

          <button
            onClick={() => setRole("buyer")}
            className="w-full py-4 px-6 bg-green-700 text-white font-bold rounded-2xl hover:bg-green-600 transition-all active:scale-[0.98] cursor-pointer text-lg"
          >
            I'm a Buyer
          </button>
        </div>
      </motion.div>
    </section>
  );
}
