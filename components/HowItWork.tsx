"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Img1 from "@/public/web-images/nigerian-farmer-using-smartphone-in-field.jpg";
import Img2 from "@/public/web-images/buyer-marketplace-interface-agricultural-products.jpg";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-green-700/35 text-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            How AgroLedger Works
          </h2>
        </motion.div>

        {/* For Farmers Row */}
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border-2 border-brand-green">
                <Image
                  src={Img1}
                  alt="Farmer Dashboard - Harvest Log"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-primary/10 text-primary text-md font-semibold rounded-full mb-1">
                For Farmers
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-shadow-black text-foreground mb-2 text-balance">
                Record Your Harvest Securely
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg text-justify text-balance">
                Every harvest you record gets a unique blockchain ID for
                complete traceability. Your produce is verifiable from farm to
                market, building trust with buyers and ensuring you receive fair
                compensation for your hard work.
              </p>
            </motion.div>
          </div>
        </div>

        {/* For Buyers Row */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-block bg-accent/20 text-accent-foreground text-md font-semibold rounded-full mb-1">
                For Buyers
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                Browse Verified Listings with Confidence
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg text-justify text-balance">
                Purchase directly from farmers knowing the exact origin of every
                product. Our blockchain verification ensures authenticity and
                quality, while eliminating unnecessary intermediaries that
                inflate costs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl bg-muted border-2 border-brand-green">
                <Image
                  src={Img2}
                  alt="Buyer Marketplace"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
