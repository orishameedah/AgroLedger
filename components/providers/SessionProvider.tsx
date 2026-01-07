"use client";

import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * We wrap the built-in NextAuth provider in a custom Client Component.
 * This allows us to use it in the Server-side Root Layout without errors.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
