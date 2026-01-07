// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = async (req: any, res: any) => {
//   // 1. Check if the user clicked "Keep me logged in" in your login form
//   // We check the 'remember' field from the request body
//   const isRememberMe = req.body?.remember === "true";

//   return await NextAuth(req, res, {
//     ...authOptions,
//     session: {
//       strategy: "jwt",
//       // If checked: 30 days. If NOT checked: 5 hours (18,000 seconds)
//       maxAge: isRememberMe ? 30 * 24 * 60 * 60 : 5 * 60 * 60,
//     },
//   });
// };

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// We use the standard NextAuth export for the App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
