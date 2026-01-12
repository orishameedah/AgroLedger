"use client";

import { Tag, Weight, Banknote, Ruler } from "lucide-react";
import { PRODUCE_CATEGORIES, UNITS_BY_CATEGORY } from "@/lib/constants";

interface ProduceFormFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  availableCategories: string[]; // <--- NEW PROP fetches category based on farmer category
}

export function ProduceFormFields({
  formData,
  setFormData,
  availableCategories,
}: ProduceFormFieldsProps) {
  const unitLabel = formData.unit || "unit";
  const productName = formData.name || "this product";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Produce Name */}
      <div className="space-y-2">
        <label className="produce-label">
          <Tag size={14} className="text-emerald-500" /> Produce Name
        </label>
        <input
          required
          className="produce-input produce-input:focus"
          placeholder="e.g. White Maize"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="produce-label">
          <Tag size={14} className="text-emerald-500" /> Category
        </label>
        <select
          required
          className="produce-input produce-input:focus"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value, unit: "" })
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

      {/* Unit */}
      <div className="space-y-2">
        <label className="produce-label">
          <Ruler size={14} className="text-emerald-500" /> Unit
        </label>
        <p className="text-[10px] text-slate-400 ml-2 italic">
          Select Measurement
        </p>
        <select
          required
          disabled={!formData.category}
          className="produce-input produce-input:focus disabled:opacity-50"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        >
          <option value="">Select Unit</option>
          {formData.category &&
            UNITS_BY_CATEGORY[formData.category].map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
        </select>
      </div>

      {/* Quantity & Price (Keep your dynamic placeholders here) */}
      <div className="space-y-2">
        <label className="produce-label">
          <Weight size={14} className="text-emerald-500" /> Quantity
        </label>
        <p className="text-[10px] text-slate-400 ml-2 italic">
          How many {unitLabel} of {productName} in stock?
        </p>
        <input
          type="number"
          // step="0.01"
          required
          className="produce-input produce-input:focus"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="produce-label">
          <Banknote size={14} className="text-emerald-500" /> Price Per Unit
        </label>
        <p className="text-[10px] text-slate-400 ml-2 italic">
          How much is one {unitLabel} of {productName}?
        </p>
        <input
          type="number"
          step="0.01"
          required
          className="produce-input produce-input:focus"
          value={formData.pricePerUnit}
          onChange={(e) =>
            setFormData({ ...formData, pricePerUnit: e.target.value })
          }
        />
      </div>
    </div>
  );
}
