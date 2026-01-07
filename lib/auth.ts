import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // 1. Find user by email OR username and EXPLICITLY ask for the hidden password
        const user = await User.findOne({
          $or: [
            { email: credentials?.identifier.toLowerCase() },
            { username: credentials?.identifier },
          ],
        }).select("+password");

        if (!user) {
          throw new Error("No user found with this email or username");
        }

        // 2. Compare the plain-text password from the form with the hash in DB
        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // 3. If everything is fine, return the user (without the password)
        // Convert to plain object to remove sensitive Mongoose data
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
    // 1. JWT Callback: Put the role and setup status into the token

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();
          const userEmail = user.email?.toLowerCase();

          // 1. Check if user already exists
          const existingUser = await User.findOne({ email: userEmail });

          if (!existingUser) {
            // 2. Create the user without a password field
            await User.create({
              name: user.name || "Agroledger User",
              email: userEmail,
              image: user.image || "",
              username:
                (userEmail?.split("@")[0] || "user") +
                Math.floor(1000 + Math.random() * 9000),
              role: "buyer",
              isSetupComplete: false,
              // Notice: We do NOT send a password field here!
            });
            console.log("✅ Google user saved to MongoDB");
          }
          return true;
        } catch (error) {
          console.error("❌ MongoDB Save Error:", error);
          return true; // Still let them in, but log the error
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Map the DB _id to token.id
        token.role = (user as any).role;
        token.isSetupComplete = (user as any).isSetupComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id; // Pass it to the session
        (session.user as any).role = token.role;
        (session.user as any).isSetupComplete = token.isSetupComplete;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    // We keep the default at 30 days here.
    maxAge: 30 * 24 * 60 * 60,
    // maxAge: 24 * 60 * 60,
  },
  pages: {
    // If you want a general error to go to a specific role,
    // it's usually better to point this to your main landing login or
    // the buyer login as a default.
    signIn: "/login/buyer",
    error: "/login/buyer",
  },
};
