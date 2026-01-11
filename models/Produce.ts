// models/Produce.ts
import mongoose, { Schema, model, models } from "mongoose";

const ProduceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },

    // Category logic: Linked to the farmer's setup categories
    category: { type: String, required: true },

    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // kg, bags, heads, etc.
    pricePerUnit: { type: Number, required: true },
    totalPrice: {
      type: Number,
      required: true,
      // Logic: quantity * pricePerUnit calculated before saving
    },

    // Blockchain & Media
    image: { type: String }, // Cloudinary Secure URL
    blockchainStatus: {
      type: String,
      enum: ["none", "processing", "published"],
      default: "none",
    },
    transactionHash: { type: String }, // The "Seal" link

    isArchived: { type: Boolean, default: false }, // For "Deleting" without losing data
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default models.Produce || model("Produce", ProduceSchema);
