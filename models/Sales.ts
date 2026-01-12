// models/Sale.ts
import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional link: If imported, we store the ID. If manual, this stays null.
    produceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produce",
      required: false,
    },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    costPrice: { type: Number, required: true }, // Auto-filled from Produce.totalPrice or manual
    amountSold: { type: Number, required: true }, // Total revenue from the sale
    quantitySold: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., "kg", "bags", "crates"
    buyerNames: [{ type: String }], // Array to support multiple buyers
    saleDate: { type: Date, required: true },
    // Profit/Loss is calculated as (amountSold - costPrice)
    profitAndLoss: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
