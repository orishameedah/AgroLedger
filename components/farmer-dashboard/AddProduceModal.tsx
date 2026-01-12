"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { saveProduce } from "@/lib/actions/produce.actions";
import { SuccessMessage } from "../ui/SuccessMessage";
import { ImageUpload } from "./ProduceImageUpload";
import { ProduceFormFields } from "./ProduceForm";
import { getFarmerCategories } from "@/lib/actions/user.actions";

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Keep for prop compatibility
  editingEntry?: any | null;
}

export function AddProduceModal({
  isOpen,
  onClose,
  editingEntry,
}: AddProduceModalProps) {
  const { data: session } = useSession();

  // --- Centralized Form State ---
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    image: "",
  });

  const [total, setTotal] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Sync state when editing or resetting
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        name: editingEntry.name,
        category: editingEntry.category,
        quantity: editingEntry.quantity.toString(),
        unit: editingEntry.unit,
        pricePerUnit: editingEntry.pricePerUnit.toString(),
        image: editingEntry.image || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        pricePerUnit: "",
        image: "",
      });
      setFileName(null);
    }
    // setShowSuccess(false);
  }, [editingEntry, isOpen]);

  // Total Calculation Logic
  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    setTotal(qty * price);
  }, [formData.quantity, formData.pricePerUnit]);

  const userId = session?.user?.id;

  useEffect(() => {
    if (isOpen && userId) {
      const loadCats = async () => {
        const cats = await getFarmerCategories(userId);
        setAvailableCategories(cats);
      };
      loadCats();
    }
  }, [isOpen, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return toast.error("User session not found.");

    setIsSubmitting(true); // 1. Start loading

    try {
      const result = await saveProduce(
        { ...formData, id: editingEntry?._id },
        session.user.id
      );

      if (result.success) {
        setShowSuccess(true);

        // 2. WAIT for the 3 seconds while KEEPING isSubmitting as true
        setTimeout(() => {
          setIsSubmitting(false); // Only stop loading when the modal is about to close
          onClose();
        }, 3000);
      } else {
        // If there's an error, we stop loading immediately so they can fix the form
        toast.error(result.error || "Failed to save entry.");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsSubmitting(false);
    }
    // DO NOT use a "finally" block here to set isSubmitting(false),
    // because that would override our 3-second wait!
  };

  return (
    <>
      <SuccessMessage isVisible={showSuccess} message="Success" />

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {editingEntry ? "Edit Entry" : "Add New Produce"}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Manage your farm inventory records.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400 cursor-pointer" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-6 max-h-[75vh] overflow-y-auto"
              >
                {/* 1. MOVED: Form Fields Component */}
                {/* <ProduceFormFields
                  formData={formData}
                  setFormData={setFormData}
                /> */}

                <ProduceFormFields
                  formData={formData}
                  setFormData={setFormData}
                  availableCategories={availableCategories}
                />

                {/* 2. MOVED: Image Upload Component */}
                <ImageUpload
                  value={formData.image}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, image: url }))
                  }
                  onFileNameChange={setFileName}
                  fileName={fileName}
                />

                {/* Total Display */}
                <div className="flex items-center justify-between p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    Total Valuation:
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    ₦{" "}
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 py-4 cursor-pointer rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 py-4 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 cursor-pointer" />{" "}
                        {editingEntry ? "Update Records" : "Confirm Entry"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
