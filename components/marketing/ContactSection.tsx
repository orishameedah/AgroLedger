"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPTS_URL;
export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch(`${SCRIPT_URL}`, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script redirects
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setStatus("success");

      // Auto-refresh logic
      setTimeout(() => {
        window.location.reload();
      }, 7000);
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus("idle");
      alert("There was an error sending your message. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="py-24 flex justify-center animate-mobile-menu">
        <div className="max-w-md w-full bg-green-50 p-10 rounded-3xl border border-green-200 shadow-xl text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Inquiry Received!
          </h2>
          <p className="text-slate-700">
            Thank you for making an Enquiry, Kindly check your email for more
            information.
          </p>
          {/* Visual Progress Bar for the 2-min refresh */}
          <div className="mt-8 h-1.5 w-full bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 animate-[progress_120s_linear]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
              Get in Touch with{" "}
              <span className="text-green-700">Agroledger</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Have questions about our blockchain ledger or how to list your
              harvest? Our team is here to support Nigeria's farming community.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Us</p>
                  <p className="text-slate-600">support@agroledger.ng</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-700">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Our Office</p>
                  <p className="text-slate-600">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Simple Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm"
          >
            <form className="space-y-5" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  placeholder="Enter your name"
                  name="name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  placeholder="your@email.com"
                  name="email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                  placeholder="How can we help you?"
                  name="message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 cursor-pointer hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending Enquiry..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
