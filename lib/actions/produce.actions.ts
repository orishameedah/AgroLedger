"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "../mongodb"; // Ensure you have a DB connection util
import Produce from "@/models/Produce";
import mongoose from "mongoose";

export async function saveProduce(data: any, userId: string) {
  try {
    await dbConnect();

    // 1. Calculate Total Price (Logic stays on server for security)
    const qty = parseFloat(data.quantity);
    const price = parseFloat(data.pricePerUnit);
    const totalPrice = qty * price;

    const produceData = {
      userId,
      name: data.name,
      category: data.category,
      quantity: qty,
      unit: data.unit,
      pricePerUnit: price,
      totalPrice: totalPrice,
      image: data.image || "", // We will handle Cloudinary later
      // image: data.image
      //     || "",
      blockchainStatus: "none",
    };

    if (data.id) {
      // 2. UPDATE Logic
      await Produce.findByIdAndUpdate(data.id, produceData);
    } else {
      // 3. CREATE Logic
      await Produce.create(produceData);
    }

    // Refresh the dashboard data
    revalidatePath("/farmer-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save produce" };
  }
}

export async function fetchAllProduce(userId: string) {
  try {
    await dbConnect();

    // Find non-archived items for this specific farmer
    const produceList = await Produce.find({
      userId,
      isArchived: { $ne: true },
    }).sort({ updatedAt: -1 }); // Newest first

    return {
      success: true,
      data: JSON.parse(JSON.stringify(produceList)),
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, data: [] };
  }
}

export async function deleteProduce(id: string) {
  try {
    await dbConnect();

    // 1. Physical Delete from MongoDB
    const deletedItem = await Produce.findByIdAndDelete(id);

    if (!deletedItem) {
      return { success: false, error: "Item not found in database." };
    }

    /* FUTURE BLOCKCHAIN LOGIC:
      if (deletedItem.isPublished) {
         await revokeBlockchainRecord(deletedItem.blockchainId);
      }
    */

    revalidatePath("/farmer-dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Critical error during deletion." };
  }
}

export async function getDashboardStats(userId: string) {
  try {
    await dbConnect();

    const stats = await Produce.aggregate([
      {
        $match: {
          // Ensure we convert the string ID from the session to a MongoDB ObjectId
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          // Simple sum of your existing totalPrice field
          totalValue: { $sum: "$totalPrice" },
          // Simple sum of your quantity field
          totalItems: { $sum: "$quantity" },
          // Count how many have been published to blockchain
          activeListings: {
            $sum: {
              $cond: [{ $eq: ["$blockchainStatus", "published"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // If stats is empty, it means the user has no produce yet
    return stats[0] || { totalValue: 0, totalItems: 0, activeListings: 0 };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return { totalValue: 0, totalItems: 0, activeListings: 0 };
  }
}
