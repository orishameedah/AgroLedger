import React from "react";
import { HeroSection } from "../../components/marketing/HeroSection";
import { AboutSection } from "../../components/marketing/AboutSection";
import { AboutSection2 } from "../../components/marketing/AboutSection2";
import { HowItWorksSection } from "../../components/marketing/HowItWork";
import { ContactSection } from "@/components/marketing/ContactSection";

const page = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <AboutSection2 />
      <HowItWorksSection />
      <ContactSection />
    </main>
  );
};

export default page;
