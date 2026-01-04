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
              Empowering Nigeria&apos;s Agricultural Future
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                Our mission is to empower smallholder farmers across
                Nigeria&apos;s food basket regions by providing them with direct
                access to markets and fair pricing through blockchain
                technology.
              </p>
              <p>
                By eliminating intermediaries and ensuring transparent,
                immutable records of every transaction, we&apos;re creating a
                more equitable agricultural ecosystem that benefits both farmers
                and buyers.
              </p>
              <p>
                AgroLedger is more than a platform—it&apos;s a movement towards
                transparency, fairness, and prosperity for Nigeria&apos;s
                agricultural sector.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
