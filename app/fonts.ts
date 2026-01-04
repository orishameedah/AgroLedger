import { Manrope, Inter } from "next/font/google";

// Configure Heading Font
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope", // This creates a CSS variable
});

// Configure Body Font
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
