import React from "react";
import { HeroSection } from "../../components/HeroSection";
import { AboutSection } from "../../components/AboutSection";
import { AboutSection2 } from "../../components/AboutSection2";
import { HowItWorksSection } from "../../components/HowItWork";
import { ContactSection } from "@/components/ContactSection";

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
