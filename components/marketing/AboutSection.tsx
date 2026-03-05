"use client";

import { motion } from "framer-motion";
import { Blocks, Handshake, Verified } from "lucide-react";
import { FeatureCard } from "./about-features";

const features = [
  {
    icon: Blocks,
    title: "Blockchain-Backed Transparency",
    description:
      "When farmers publish produce to the marketplace, the transaction is securely recorded on the blockchain, ensuring transparency and preventing data manipulation.",
  },
  {
    icon: Handshake,
    title: "Direct Market Access",
    description:
      "AgroLedger removes unnecessary intermediaries by allowing farmers to list produce directly and buyers can see clear pricing and source information",
  },
  {
    icon: Verified,
    title: "Verified Provenance",
    description:
      "Each published produce listing is assigned a unique digital identifier, enabling buyers to verify authenticity.",
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
