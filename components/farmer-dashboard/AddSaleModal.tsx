"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Info } from "lucide-react";
import { toast } from "react-hot-toast";

import { createSale, updateSale } from "@/lib/actions/sales.actions";
import { fetchAllProduce } from "@/lib/actions/produce.actions";
import { SuccessMessage } from "../ui/SuccessMessage";
import { BuyerRow } from "./BuyerUI";

export function AddSaleModal({ isOpen, onClose, editingSale }: any) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [produceList, setProduceList] = useState<any[]>([]);
  const [selectedProduce, setSelectedProduce] = useState<any>(null);

  const [buyers, setBuyers] = useState([
    { name: "", quantity: "", amountSold: "" },
  ]);

  // 2. Fixes 'setFormData'
  const [formData, setFormData] = useState({
    produceId: "",
    productName: "",
    category: "",
    unit: "",
    unitPriceAtCost: 0,
    stockBeforeSale: 0,
    valuationBeforeSale: 0,
    saleDate: new Date().toISOString().split("T")[0],
  });

  // 2. CALCULATE TOTALS FIRST (The "totalQty" definition)
  const totalQty = buyers.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const totalReceived = buyers.reduce(
    (sum, b) => sum + Number(b.amountSold || 0),
    0
  );

  // 2. Separate Manual vs Automatic Mode
  const isManual = !selectedProduce;

  // 3. Calculate Limits (Only for Automatic)
  const availableInStore = selectedProduce?.quantity || 0;
  const alreadySoldInThisRecord = editingSale
    ? editingSale.totalQuantitySold
    : 0;
  const trueLimit = availableInStore + alreadySoldInThisRecord;

  // 4. The Guard: Only error if NOT manual and stock is wrong
  const isExceeded = !isManual && totalQty > trueLimit;
  const isOutOfStock = !isManual && trueLimit <= 0;

  const errorMessage = isOutOfStock
    ? "This item is completely out of stock!"
    : isExceeded
    ? `Quantity exceeded! You only have ${trueLimit} units available.`
    : null;

  // 5. Button Lock Logic: Requires a Name and at least 1 unit sold
  const isInvalid = !!errorMessage || !formData.productName || totalQty <= 0;

  // Fetch Inventory for the Import Dropdown
  useEffect(() => {
    if (session?.user?.id && isOpen) {
      fetchAllProduce(session.user.id).then(
        (res) => res.success && setProduceList(res.data)
      );
    }
  }, [isOpen, session]);

  // Sync for Edit or Reset
  useEffect(() => {
    if (editingSale) {
      setFormData({
        ...editingSale,
        saleDate: new Date(editingSale.saleDate).toISOString().split("T")[0],
      });
      setBuyers(
        editingSale.buyers || [{ name: "", quantity: "", amountSold: "" }]
      );
      // C. NEW: Find the produce in the list so the Emerald Card shows up
      if (produceList.length > 0) {
        const item = produceList.find((p) => p._id === editingSale.produceId);
        if (item) setSelectedProduce(item);
      }
    } else {
      setBuyers([{ name: "", quantity: "", amountSold: "" }]);
      setFormData({
        produceId: "",
        productName: "",
        category: "",
        unit: "",
        unitPriceAtCost: 0,
        stockBeforeSale: 0,
        valuationBeforeSale: 0,
        saleDate: new Date().toISOString().split("T")[0],
      });
      setSelectedProduce(null);
    }
  }, [editingSale, isOpen, produceList]);

  // 3. THE AUTOMATION: Handle Auto-Import
  const handleAutoImport = (id: string) => {
    const item = produceList.find((p) => p._id === id);
    setSelectedProduce(item);
    if (item) {
      setFormData({
        ...formData,
        produceId: item._id,
        productName: item.name,
        category: item.category,
        unit: item.unit,
        unitPriceAtCost: item.pricePerUnit,
        stockBeforeSale: item.quantity,
        valuationBeforeSale: item.totalPrice,
      });
    }
  };

  const updateBuyer = (index: number, field: string, value: string) => {
    const newBuyers = [...buyers] as any;
    newBuyers[index][field] = value;
    setBuyers(newBuyers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return; // Final safety check

    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      // Force produceId to null if it's a manual entry
      produceId: isManual ? null : formData.produceId,
      buyers,
      totalQuantitySold: totalQty,
      totalAmountReceived: totalReceived,
    };

    const result = editingSale
      ? await updateSale(editingSale._id, submissionData)
      : await createSale(session?.user?.id!, submissionData);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } else {
      // Show the actual error from the server if it exists
      toast.error("Failed to save.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SuccessMessage
        isVisible={showSuccess}
        message="Sales Report Processed"
      />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                <h2 className="text-2xl font-black">
                  {editingSale ? "Edit Sales Record" : "New Sale Entry"}
                </h2>
                <X
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                  onClick={onClose}
                />
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-8 overflow-y-auto"
              >
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-600 p-5 rounded-3xl flex items-center gap-4 border border-red-500 shadow-xl shadow-red-100 dark:shadow-none"
                  >
                    <div className="p-2 bg-white/20 rounded-xl text-white">
                      <Info size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white leading-tight">
                        {errorMessage}
                      </p>
                      <p className="text-[11px] text-red-100 font-medium mt-0.5">
                        Please adjust the quantities to match your store
                        balance.
                      </p>
                    </div>
                  </motion.div>
                )}
                {/* SECTION 1: IMPORT & SNAPSHOT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {!editingSale && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        1. Import from Inventory
                      </label>
                      <select
                        className="produce-input"
                        onChange={(e) => handleAutoImport(e.target.value)}
                      >
                        <option value="">
                          -- Manual Entry (Type Details) --
                        </option>
                        {produceList.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.quantity} {p.unit} in stock)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedProduce && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-3xl border border-emerald-100 flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                          Current store Balance
                        </p>
                        <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                          {selectedProduce.quantity} {selectedProduce.unit}{" "}
                          currently in stock
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                          Total Valuation
                        </p>
                        <p className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                          ₦{selectedProduce.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: PRODUCT INFO */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 rounded-4xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Product Name
                    </label>
                    <input
                      className="produce-input"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          productName: e.target.value,
                        })
                      }
                      placeholder="e.g. Maize"
                    />
                  </div>

                  {/* NEW: Unit Field for Manual Entry */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Unit
                    </label>
                    <input
                      className="produce-input"
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      placeholder="e.g. bags / kg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Category
                    </label>
                    <input
                      className="produce-input"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="e.g. Cereal"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                      Sale Date
                    </label>
                    <input
                      type="date"
                      className="produce-input"
                      value={formData.saleDate}
                      onChange={(e) =>
                        setFormData({ ...formData, saleDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* SECTION 3: SPREADSHEET (Responsive Rows) */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      2. Buyers Spreadsheet
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setBuyers([
                          ...buyers,
                          { name: "", quantity: "", amountSold: "" },
                        ])
                      }
                      className="text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-all"
                    >
                      + Add Another Buyer
                    </button>
                  </div>
                  <div className="space-y-3">
                    {buyers.map((b, i) => (
                      <BuyerRow
                        key={i}
                        index={i}
                        buyer={b}
                        updateBuyer={updateBuyer}
                        removeBuyer={(idx: number) =>
                          setBuyers(buyers.filter((_, i) => i !== idx))
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* STICKY SUMMARY BAR */}
                <div className="sticky bottom-0 bg-slate-900 p-8 rounded-4xl text-white flex justify-between items-center shadow-2xl border-t border-slate-800">
                  <div>
                    <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
                      Total Quantity Deducted
                    </p>
                    <p className="text-2xl font-black">
                      {totalQty}{" "}
                      <span className="text-xs opacity-50">
                        {formData.unit || "Units"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
                      Total Cash Received
                    </p>
                    <p className="text-2xl font-black text-emerald-400">
                      ₦{totalReceived.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-5 font-bold text-slate-400 hover:bg-slate-100 rounded-3xl transition-colors"
                  >
                    Cancel
                  </button>
                  {/* <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save size={20} />{" "}
                        {editingSale
                          ? "Update Report"
                          : "Confirm & Sync Inventory"}
                      </>
                    )}
                  </button> */}
                  <button
                    type="submit"
                    // Locked if submitting, if there's a stock error, or if name/qty is missing
                    disabled={isSubmitting || isInvalid}
                    className={`flex-2 py-5 font-black rounded-3xl shadow-lg flex items-center justify-center gap-3 transition-all ${
                      isInvalid
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-emerald-600 text-white active:scale-95 shadow-emerald-100"
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    {editingSale ? "Update Report" : "Confirm Sales Record"}
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
