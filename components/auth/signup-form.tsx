"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import axios from "axios";
import { SignupSchema, SignupInput } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { SuccessMessage } from "../ui/SuccessMessage";

interface AuthFormProps {
  mainTitle: string; // Title above the card (e.g., Agroledger Dashboard)
  formTitle: string; // Title inside the card (e.g., SignUp to Dashboard)
  role: "farmer" | "buyer";
}

export const SignUpForm = ({ mainTitle, formTitle, role }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false); // Initial state is hidden
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setServerError(null);
    try {
      // 1. Send data to our custom signup API
      await axios.post("/api/auth/signup", {
        ...data,
        role, // Pass the role prop (farmer or buyer)
      });

      // 2. On success, redirect to login
      setShowSuccess(true);

      setTimeout(() => {
        router.push(role === "farmer" ? "/login/farmer" : "/login/buyer");
      }, 3000);
      // router.push(role === "farmer" ? "/login/farmer" : "/login/buyer");
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleGoogleSignup = () => {
    // Redirects to setup for farmers or marketplace for buyers after Google login
    const callbackUrl = role === "farmer" ? "/farmer-setup" : "/marketplace";
    signIn("google", { callbackUrl });
  };

  // Dynamically set the signup link based on the role prop
  const loginPath = role === "farmer" ? "/login/farmer" : "/login/buyer";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggles true/false
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90 z-10">
      <SuccessMessage
        isVisible={showSuccess}
        message="Signup successfully! Redirecting to login..."
      />
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
          onClick={handleGoogleSignup}
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

        {/* Display Server Errors */}
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
            {serverError}
          </div>
        )}

        {/* Manual Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              {...register("name")}
              placeholder="Your full name"
              className={`input-field ${
                errors.name ? "error-name1" : "error-name2"
              } input-field:focus`}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label">Username</label>
            <input
              {...register("username")}
              placeholder="Your username"
              className={`input-field ${
                errors.username ? "error-name1" : "error-name2"
              } input-field:focus`}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              {...register("email")}
              placeholder="john@example.com"
              className={`input-field ${
                errors.email ? "error-name1" : "error-name2"
              } input-field:focus`}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              {" "}
              <input
                {...register("password")}
                // Conditional type based on state
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`input-field ${
                  errors.password ? "error-name1" : "error-name2"
                } input-field:focus`}
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
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="button-form">
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              `Create ${role === "farmer" ? "Farmer" : "Buyer"} Account`
            )}
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
