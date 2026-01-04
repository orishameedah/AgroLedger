"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -10 }}
      className="h-full  rounded-2xl border bg-white px-8 py-12 text-center transition-all border-green-600/50 hover:shadow-xl"
    >
      {/* Icon Container - Higher contrast green */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Icon className="h-8 w-8" />
      </div>

      {/* Title - Use deep slate for maximum contrast */}
      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>

      {/* Description - Slate-600 is much more readable than muted-foreground */}
      <p className="text-base leading-relaxed text-slate-600">{description}</p>
    </motion.div>
  );
}
