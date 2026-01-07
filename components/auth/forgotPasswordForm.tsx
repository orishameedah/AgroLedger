"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema, ResetPasswordInput } from "@/lib/zod";
import axios from "axios";
import { Loader2, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SuccessMessage } from "../ui/SuccessMessage";

interface ForgotPasswordProps {
  role: "farmer" | "buyer";
}

export const ForgotPasswordForm = ({ role }: ForgotPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError("");
    try {
      await axios.post("/api/auth/reset-password", {
        ...data,
        role,
      });

      setShowSuccess(true);

      setTimeout(() => {
        router.push(role === "farmer" ? "/login/farmer" : "/login/buyer");
      }, 3000);

      // Redirect immediately upon success
      router.push(role === "farmer" ? "/login/farmer" : "/login/buyer");
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90">
      <SuccessMessage
        isVisible={showSuccess}
        message="Password updated! Redirecting to login..."
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Reset {role === "farmer" ? "Farmer" : "Buyer"} Password
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          Enter your registered email and a new secure password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              {...register("email")}
              className={`input-field ${
                errors.email ? "border-red-500 bg-red-50" : ""
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 1. NEW PASSWORD */}
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                // pr-12 prevents text from going under the eye icon
                className={`input-field pr-12 ${
                  errors.password ? "border-red-500 bg-red-50" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-400 hover:text-green-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 2. CONFIRM PASSWORD */}
          <div>
            <label className="label">Confirm New Password</label>
            {/* Added 'relative' here to fix the floating icon issue */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`input-field pr-12 ${
                  errors.confirmPassword ? "border-red-500 bg-red-50" : ""
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-400 hover:text-green-600 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="button-form">
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
};
