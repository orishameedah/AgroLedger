"use client";

import { Trash2, User, Weight, Banknote } from "lucide-react";

export function BuyerRow({ index, buyer, updateBuyer, removeBuyer }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700">
      {/* 1. Buyer Name */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
          Buyer Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            className="settings-input pl-10"
            placeholder="Name"
            value={buyer.name}
            onChange={(e) => updateBuyer(index, "name", e.target.value)}
          />
        </div>
      </div>

      {/* 2. Quantity Sold */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
          Quantity
        </label>
        <div className="relative">
          <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="number"
            className="settings-input pl-10"
            placeholder="0"
            value={buyer.quantity}
            onChange={(e) => updateBuyer(index, "quantity", e.target.value)}
          />
        </div>
      </div>

      {/* 3. Amount Paid */}
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
          Amount Paid (₦)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="number"
              className="settings-input pl-10"
              placeholder="0.00"
              value={buyer.amountSold}
              onChange={(e) => updateBuyer(index, "amountSold", e.target.value)}
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              onClick={() => removeBuyer(index)}
              className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
