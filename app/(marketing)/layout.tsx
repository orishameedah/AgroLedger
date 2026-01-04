import "../globals.css";
import { manrope, inter } from "../fonts";
import { Metadata } from "next";
import Header from "../../components/Header";
import LightRays from "../../components/LightRays";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgroLedger | Transparent Agriculture",
  description: "Direct farm-to-buyer marketplace",
};

export default function MarketingLayout({
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
        <Header />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center"
            raysColor="#fef3c7" // Warm sun rays
            raysSpeed={0.9} // Slower is more "Human/Calm"
            lightSpread={3}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.2}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        {children}
        <Footer />
      </body>
    </html>
  );
}
