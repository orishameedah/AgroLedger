import { NextAuthOptions, User as NextAuthUser, Session } from "next-auth"; // Renamed for clarity
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/User"; // Renamed import to avoid collision
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // This FORCES the pop-up to show all accounts
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials?.identifier.toLowerCase() },
            { username: credentials?.identifier },
          ],
        }).select("+password");

        if (!user) throw new Error("No user found with this email or username");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password,
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          isSetupComplete: user.isSetupComplete,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const userEmail = user.email?.toLowerCase();
          const existingUser = await UserModel.findOne({ email: userEmail });

          // READ THE STICKY NOTE
          const cookieStore = cookies();
          const detectedRole =
            (await cookieStore).get("agro_role")?.value || "buyer";

          if (!existingUser) {
            await UserModel.create({
              name: user.name || "Agroledger User",
              email: userEmail,
              // image: user.image || "",
              image: user.image || (profile as any)?.picture || "",
              username:
                (userEmail?.split("@")[0] || "user") +
                Math.floor(1000 + Math.random() * 9000),
              // role: "buyer",
              role: detectedRole,
              isSetupComplete: false,
            });
          }
          return true;
        } catch (error) {
          console.error("❌ MongoDB Save Error:", error);
          return true;
        }
      }
      return true;
    },

    // Using the types explicitly to satisfy TypeScript
    async jwt({
      token,
      user,
      trigger,
      session,
      account,
    }: {
      token: JWT;
      user?: any;
      trigger?: string;
      session?: any;
      account?: any;
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isSetupComplete = user.isSetupComplete;
        token.username = user.username;
      }

      if (!token.role && token.email) {
        await dbConnect();
        const dbUser = await UserModel.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.isSetupComplete = dbUser.isSetupComplete;
          token.username = dbUser.username;
        }
      }

      if (trigger === "update" && session?.user) {
        // This updates the data inside the JWT cookie
        token.name = session.user.name;
        token.username = session.user.username;
        if (session.user.isSetupComplete !== undefined) {
          token.isSetupComplete = session.user.isSetupComplete;
        }
      }

      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isSetupComplete = token.isSetupComplete;
        session.user.username = token.username;

        // Sync the session name with the updated token name
        session.user.name = token.name;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login/buyer",
    error: "/login/buyer",
  },
};
