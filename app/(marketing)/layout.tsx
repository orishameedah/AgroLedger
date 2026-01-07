import "../globals.css";
import Header from "../../components/marketing/Header";
import LightRays from "../../components/marketing/LightRays";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
