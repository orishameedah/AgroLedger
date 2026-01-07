// app/layout.tsx
import { manrope, inter } from "./fonts"; // Adjust path to your fonts
import "./globals.css";
import { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "AgroLedger | Transparent Agriculture",
  description: "Direct farm-to-buyer marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
        style={{ maxWidth: "2000px" }}
      >
        {/* Everything inside here has access to Authentication */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
