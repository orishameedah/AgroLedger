import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// We use the standard NextAuth export for the App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
