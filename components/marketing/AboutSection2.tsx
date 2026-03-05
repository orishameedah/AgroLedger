"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import backgroundImg from "@/public/web-images/african-community-support-agriculture-teamwork.jpg";

export function AboutSection2() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-4/3 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={backgroundImg}
                alt="Farmer using smartphone"
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            {/* <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance"> */}
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Building Trust in Nigeria’s Agricultural Marketplace
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                AgroLedger is designed to support smallholder farmers by
                providing a structured digital system for managing and
                publishing agricultural produce to a verified online
                marketplace.
              </p>
              <p>
                Through role-based access and blockchain-backed verification,
                the platform enhances transparency, reduces disputes, and
                strengthens trust between farmers and buyers.
              </p>
              <p>
                By combining digital record-keeping with semi-decentralized
                verification, AgroLedger contributes to a more accountable and
                efficient agricultural supply chain in Nigeria.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
