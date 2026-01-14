import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    produceId: { type: mongoose.Schema.Types.ObjectId, ref: "Produce" },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },

    // --- INVENTORY SNAPSHOT (The "Cool" Evaluation) ---
    stockBeforeSale: { type: Number, required: true }, // e.g., 100
    valuationBeforeSale: { type: Number, required: true }, // e.g., ₦12,560,000
    unitPriceAtCost: { type: Number, required: true }, // e.g., ₦125,600

    // --- SALE TOTALS (Calculated from Buyers) ---
    totalQuantitySold: { type: Number, required: true }, // e.g., 2
    totalAmountReceived: { type: Number, required: true }, // e.g., ₦250,800

    saleDate: { type: Date, default: Date.now },

    // --- BUYER LIST (Simplified) ---
    buyers: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true }, // e.g., 1
        amountSold: { type: Number, required: true }, // e.g., ₦125,400 (The buyer's total)
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
