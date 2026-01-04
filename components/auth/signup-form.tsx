"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface AuthFormProps {
  mainTitle: string; // Title above the card (e.g., Agroledger Dashboard)
  formTitle: string; // Title inside the card (e.g., SignUp to Dashboard)
  role: "farmer" | "buyer";
}

export const SignUpForm = ({ mainTitle, formTitle, role }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false); // Initial state is hidden

  // Dynamically set the signup link based on the role prop
  const loginPath = role === "farmer" ? "/login/farmer" : "/login/buyer";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggles true/false
  };
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90 z-10">
      {/* Top Header Label */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white text-2xl md:text-3xl font-bol mb-4 text-center tracking-tight"
      >
        {mainTitle}
      </motion.h1>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-20 w-full max-w-lg overflow-hidden rounded-3xl bg-white px-8 md:px-12 py-6 shadow-2xl border border-slate-200"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-medium text-slate-900">{formTitle}</h2>
          <p className="text-slate-500 mt-1">Create an account</p>
        </div>

        {/* Google Auth Button */}
        <button
          className="w-full py-3 px-6 text-slate-700 font-bold border-2 border-slate-200 rounded-2xl flex items-center 
        text-md justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
        >
          <FcGoogle className="w-6 h-6" />
          Signup with Google
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Manual Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Your username"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 outline-none transition-all bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 outline-none transition-all bg-slate-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              {" "}
              <input
                // Conditional type based on state
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-4 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 outline-none transition-all bg-slate-50/50"
                required
              />
              {/* Toggle Button */}
              <button
                type="button" // Important: prevents form submission
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-400 hover:text-green-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              I agree to the Terms of Service
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98] cursor-pointer"
          >
            Create {role === "farmer" ? "Farmer" : "Buyer"} Account
          </button>
        </form>

        <p className="mt-4 text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <Link
            href={loginPath}
            className="text-green-600 font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
};
