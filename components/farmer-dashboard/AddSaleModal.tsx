"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Info } from "lucide-react";
import { toast } from "react-hot-toast";

import { createSale, updateSale } from "@/lib/actions/sales.actions";
import { fetchAllProduce } from "@/lib/actions/produce.actions";
import { getFarmerCategories } from "@/lib/actions/user.actions";
import { UNITS_BY_CATEGORY } from "@/lib/constants";

import { BuyerRow } from "./BuyerUI";

export function AddSaleModal({ isOpen, onClose, editingSale }: any) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [produceList, setProduceList] = useState<any[]>([]);
  // We initialize with default keys as a fallback
  const [availableCategories, setAvailableCategories] = useState<string[]>(
    Object.keys(UNITS_BY_CATEGORY),
  );
  const [selectedProduce, setSelectedProduce] = useState<any>(null);

  const [buyers, setBuyers] = useState([
    { name: "", quantity: "", amountSold: "" },
  ]);

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

  // --- LOGIC CALCULATIONS ---
  const totalQty = buyers.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const totalReceived = buyers.reduce(
    (sum, b) => sum + Number(b.amountSold || 0),
    0,
  );
  const isManual = !selectedProduce;

  const availableInStore = selectedProduce?.quantity || 0;
  const alreadySoldInThisRecord = editingSale
    ? editingSale.totalQuantitySold
    : 0;
  const trueLimit = availableInStore + alreadySoldInThisRecord;

  const isExceeded = !isManual && totalQty > trueLimit;
  const isOutOfStock = !isManual && trueLimit <= 0;

  const errorMessage = isOutOfStock
    ? "This item is completely out of stock!"
    : isExceeded
      ? `Quantity exceeded! You only have ${selectedProduce.quantity} ${selectedProduce.unit} available.`
      : null;

  const isInvalid =
    !!errorMessage ||
    !formData.productName ||
    totalQty <= 0 ||
    !formData.category ||
    !formData.unit;

  // --- FETCHING DATA ---
  useEffect(() => {
    if (session?.user?.id && isOpen) {
      // Fetch Produce for Auto-Import
      fetchAllProduce(session.user.id).then((res) => {
        if (res.success) setProduceList(res.data);
      });
      // Fetch Categories
      const loadCats = async () => {
        const cats = await getFarmerCategories(session.user.id);
        setAvailableCategories(cats);
      };
      loadCats();
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
        editingSale.buyers || [{ name: "", quantity: "", amountSold: "" }],
      );

      if (produceList.length > 0) {
        const item = produceList.find((p) => p._id === editingSale.produceId);
        if (item) setSelectedProduce(item);
      }
    } else {
      resetForm();
    }
  }, [editingSale, isOpen, produceList]);

  const resetForm = () => {
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
  };

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
        valuationBeforeSale: item.quantity * item.pricePerUnit, // $Valuation = Qty \times Price$
      });
    } else {
      resetForm();
    }
  };

  const updateBuyer = (index: number, field: string, value: string) => {
    const newBuyers = [...buyers] as any;
    newBuyers[index][field] = value;
    setBuyers(newBuyers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) return;

    setIsSubmitting(true);
    const submissionData = {
      ...formData,
      produceId: isManual ? null : formData.produceId,
      buyers,
      totalQuantitySold: totalQty,
      totalAmountReceived: totalReceived,
    };

    const result = editingSale
      ? await updateSale(editingSale._id, submissionData)
      : await createSale(session?.user?.id!, submissionData);

    if (result.success) {
      toast.success("Sales record saved successfully!");
      setIsSubmitting(false);
      onClose();
    } else {
      toast.error("Failed to save record.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* HEADER */}
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black">
                {editingSale ? "Edit Sales Record" : "New Sale Entry"}
              </h2>
              <X
                className="cursor-pointer text-slate-400 hover:text-slate-600"
                onClick={onClose}
              />
            </div>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-red-600 p-5 rounded-3xl flex items-center gap-4 border border-red-500 shadow-xl mb-4"
                >
                  <div className="p-2 bg-white/20 rounded-xl text-white">
                    <Info size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-tight">
                      {errorMessage}
                    </p>
                    <p className="text-[11px] text-red-100 font-medium mt-0.5">
                      Please adjust the quantities to match your store balance.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-8 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!editingSale && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      1. Import from Inventory
                    </label>
                    <select
                      className="produce-input"
                      onChange={(e) => handleAutoImport(e.target.value)}
                      value={formData.produceId}
                    >
                      <option value="">-- Manual Entry --</option>
                      {produceList.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.quantity} {p.unit} in stock)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedProduce && (
                  <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase">
                        Stock Balance
                      </p>
                      <p className="text-sm font-black text-emerald-900">
                        {selectedProduce.quantity} {selectedProduce.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-emerald-600 uppercase">
                        Current Valuation
                      </p>
                      <p className="text-sm font-black text-emerald-900">
                        ₦
                        {(
                          selectedProduce.quantity *
                          selectedProduce.pricePerUnit
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* PRODUCT INFO - FIXING THE SELECTS HERE */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 rounded-4xl border border-slate-100">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    className="produce-input"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    placeholder="e.g. Maize"
                  />
                </div>

                {/* CATEGORY SELECT */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    Category
                  </label>
                  <select
                    required
                    className="produce-input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        unit: "",
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* UNIT SELECT */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    Unit
                  </label>
                  <select
                    required
                    disabled={!formData.category}
                    className="produce-input disabled:opacity-50"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    <option value="">Select Unit</option>
                    {formData.category &&
                      UNITS_BY_CATEGORY[formData.category]?.map((u: string) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    Sale Date
                  </label>
                  <input
                    type="date"
                    required
                    className="produce-input"
                    value={formData.saleDate}
                    onChange={(e) =>
                      setFormData({ ...formData, saleDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* BUYERS SPREADSHEET */}
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
                    className="text-[10px] font-bold cursor-pointer text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full"
                  >
                    + Add Another Buyer
                  </button>
                </div>
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

              {/* SUMMARY & ACTIONS */}
              <div className="sticky bottom-0 bg-slate-900 p-8 rounded-4xl text-white flex justify-between items-center shadow-2xl">
                <div>
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
                    Total Qty Sold
                  </p>
                  <p
                    className={`text-2xl font-black ${isExceeded ? "text-red-400" : "text-white"}`}
                  >
                    {totalQty}{" "}
                    <span className="text-xs opacity-50">
                      {formData.unit || "Units"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest">
                    Total Received
                  </p>
                  <p className="text-2xl font-black text-emerald-400">
                    ₦{totalReceived.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 font-bold cursor-pointer text-slate-400 hover:bg-slate-100 rounded-3xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isInvalid}
                  className={`flex-2 py-5 font-black cursor-pointer rounded-3xl shadow-lg flex items-center justify-center gap-3 transition-all ${
                    isInvalid
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-600 text-white active:scale-95"
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
  );
}
