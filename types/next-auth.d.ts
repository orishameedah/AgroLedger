import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isSetupComplete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isSetupComplete: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isSetupComplete: boolean;
  }
}
