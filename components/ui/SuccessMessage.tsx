"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  isVisible: boolean;
  message: string;
}

export const SuccessMessage = ({ isVisible, message }: SuccessMessageProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        /* The overlay container ensures it sits on top of everything */
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-1/2 z-100 w-[90%] max-w-md"
        >
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-2xl flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle2 className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm tracking-tight">
                Success!
              </p>
              <p className="text-slate-500 text-xs font-medium">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
