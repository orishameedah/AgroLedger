"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User, X, PlayCircle } from "lucide-react"; // Added PlayCircle
import { useState } from "react";
import { VideoModal } from "./VideoModal";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({ isOpen, onClose }: RoleModalProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const tutorialVideos = {
    farmer: "https://www.youtube.com/embed/POITehLy-KU",
    buyer: "https://www.youtube.com/embed/X0z2pmUKLiM",
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200"
            >
              <button
                onClick={onClose}
                className="absolute right-6 cursor-pointer top-6 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Join Agroledger
                </h2>
                <p className="text-slate-500">
                  How would you like to use our platform?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Farmer Card */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/signup/farmer"
                    className="group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50 hover:border-emerald-500 hover:bg-white transition-all text-center"
                  >
                    <div className="bg-emerald-500 text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Farmer</h3>
                      <p className="text-xs text-slate-500">
                        Log your harvest & find buyers
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setVideoUrl(tutorialVideos.farmer)}
                    className="flex items-center cursor-pointer justify-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 py-2"
                  >
                    <PlayCircle size={16} /> Watch Tutorial
                  </button>
                </div>

                {/* Buyer Card */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/signup/buyer"
                    className="group flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-amber-100 bg-amber-50 hover:border-amber-500 hover:bg-white transition-all text-center"
                  >
                    <div className="bg-amber-500 text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Buyer</h3>
                      <p className="text-xs text-slate-500">
                        Source verified local produce
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setVideoUrl(tutorialVideos.buyer)}
                    className="flex items-center cursor-pointer justify-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 py-2"
                  >
                    <PlayCircle size={16} /> Watch Tutorial
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* The Actual Video Player Modal */}
      <VideoModal
        isOpen={!!videoUrl}
        onClose={() => setVideoUrl(null)}
        videoUrl={videoUrl || ""}
      />
    </>
  );
}
