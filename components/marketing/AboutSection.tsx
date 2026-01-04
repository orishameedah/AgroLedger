"use client";

import { motion } from "framer-motion";
import { Blocks, Handshake, Verified } from "lucide-react";
import { FeatureCard } from "./about-features";

const features = [
  {
    icon: Blocks,
    title: "Immutable Records",
    description:
      "Every transaction is permanently recorded on the blockchain, ensuring complete transparency and trust in the supply chain.",
  },
  {
    icon: Handshake,
    title: "Direct Market Access",
    description:
      "Connect farmers directly with buyers, removing middlemen and ensuring fair compensation for agricultural producers.",
  },
  {
    icon: Verified,
    title: "Verified Provenance",
    description:
      "Every harvest carries a digital certificate of origin, allowing buyers to verify the quality and source of their food directly from the soil it was grown in.",
  },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-emerald-50" id="about">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why AgroLedger?
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
