// import NextAuth, { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//       isSetupComplete: boolean;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id: string;
//     role: string;
//     isSetupComplete: boolean;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: string;
//     isSetupComplete: boolean;
//   }
// }

import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    isSetupComplete: boolean;
    username: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      isSetupComplete: boolean;
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isSetupComplete: boolean;
    username: string;
  }
}
