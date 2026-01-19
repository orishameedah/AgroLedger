// models/Produce.ts
import mongoose, { Schema, model, models } from "mongoose";

const ProduceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },

    // Category logic: Linked to the farmer's setup categories
    category: { type: String, required: true, index: true },

    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true }, // kg, bags, heads, etc.
    pricePerUnit: { type: Number, required: true, min: 0 },
    totalPrice: {
      type: Number,
      required: true,
      // Logic: quantity * pricePerUnit calculated before saving
    },

    // Blockchain & Media
    image: { type: String }, // Cloudinary Secure URL

    isPublished: { type: Boolean, default: false, index: true },

    blockchainStatus: {
      type: String,
      enum: ["none", "processing", "published"],
      default: "none",
    },
    transactionHash: { type: String }, // The "Seal" link
    lastSyncedAt: { type: Date }, // To show "Verified 2 hours ago"

    isArchived: { type: Boolean, default: false }, // For "Deleting" without losing data
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Indexes for fast queries
ProduceSchema.index({ userId: 1 });
ProduceSchema.index({ isPublished: 1, category: 1 });
export default models.Produce || model("Produce", ProduceSchema);
