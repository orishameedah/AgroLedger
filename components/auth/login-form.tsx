"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SuccessMessage } from "../ui/SuccessMessage";

interface AuthFormProps {
  mainTitle: string; // Title above the card (e.g., Agroledger Dashboard)
  formTitle: string; // Title inside the card (e.g., SignUp to Dashboard)
  role: "farmer" | "buyer";
}

export const LoginForm = ({ mainTitle, formTitle, role }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false); // Initial state is hidden
  const [showSuccess, setShowSuccess] = useState(false);

  // Dynamically set the signup link based on the role prop
  const signupPath = role === "farmer" ? "/signup/farmer" : "/signup/buyer";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggles true/false
  };

  const [error, setError] = useState("");
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = useState(false); // New state for global loading
  const [fieldErrors, setFieldErrors] = useState({
    identifier: "",
    password: "",
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // --- GOOGLE LOGIN LOGIC ---
  const handleGoogleLogin = async () => {
    setIsRedirecting(true);
    // const callbackUrl = role === "farmer" ? "/farmer-setup" : "/marketplace";
    // await signIn("google", { callbackUrl });

    // We add the role to the URL so we can "catch" it later
    const callbackUrl =
      role === "farmer"
        ? "/farmer-setup?role=farmer"
        : "/marketplace?role=buyer";

    await signIn("google", { callbackUrl });
  };

  const onLogin = async (data: LoginInput) => {
    // 1. Reset all errors immediately
    setFieldErrors({ identifier: "", password: "" });
    setError("");

    try {
      // 2. Attempt Sign In
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      // 3. Handle Errors
      if (result?.error) {
        const errorMsg = result.error.toLowerCase();

        if (errorMsg.includes("user") || errorMsg.includes("email")) {
          setFieldErrors((prev) => ({
            ...prev,
            identifier: "Username or Email doesn't exist",
          }));
        } else if (
          errorMsg.includes("password") ||
          errorMsg.includes("credentials")
        ) {
          setFieldErrors((prev) => ({
            ...prev,
            password: "Incorrect Password",
          }));
        } else {
          setError("Something went wrong. Please try again later.");
        }
        return;
      }

      // 4. Success Path
      if (result?.ok) {
        // Trigger the Universal Success Popup
        setShowSuccess(true);

        // We wait for 2 seconds (2000ms) so the user can actually read the success message
        setTimeout(() => {
          setIsRedirecting(true); // Show the button loader/spinner

          const path = role === "farmer" ? "/farmer-setup" : "/marketplace";

          router.push(path);
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setError("A network error occurred. Check your connection.");
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 md:p-6 overflow-hidden bg-linear-to-b from-green-950/90 via-black/80 to-emerald-950/90 z-10">
      <SuccessMessage
        isVisible={showSuccess}
        message="Login successful! Redirecting you now..."
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
        </div>

        {/* Google Auth Button */}
        <button
          className="w-full py-3 px-6 text-slate-700 font-bold border-2 border-slate-200 rounded-2xl flex items-center 
        text-md justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-6 h-6" />
          Login with Google
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
        <form className="space-y-4" onSubmit={handleSubmit(onLogin)}>
          <div>
            <label className="label">Email Address or Username</label>
            <input
              {...register("identifier")}
              placeholder="john@example.com"
              className={`input-field ${
                errors.identifier || fieldErrors.identifier
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
            />
            {(errors.identifier || fieldErrors.identifier) && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.identifier?.message || fieldErrors.identifier}
              </p>
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              {" "}
              <input
                // Conditional type based on state
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`input-field ${
                  errors.password || fieldErrors.password
                    ? "border-red-500 bg-red-50"
                    : ""
                }`}
                {...register("password")}
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
            {(errors.password || fieldErrors.password) && (
              <p className="text-red-500 text-xs mt-1 font-semibold">
                {errors.password?.message || fieldErrors.password}
              </p>
            )}
          </div>

          <div className="flex justify-start">
            <Link
              href={`/forgot-password/${role}`}
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="button-form"
            disabled={isSubmitting || isRedirecting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5 items-center justify-center" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-slate-600 text-sm">
          Don't have an account yet ?{" "}
          <Link
            href={signupPath}
            className="text-green-600 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </section>
  );
};
