"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "../mongodb"; // Ensure you have a DB connection util
import Produce from "@/models/Produce";
import mongoose from "mongoose";
import { getAgroledgerContract } from "@/lib/blockchain/provider";

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
    revalidatePath("/marketplace");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save produce" };
  }
}

export async function fetchAllProduce(userId: string) {
  try {
    await dbConnect();

    const produceList = await Produce.find({
      userId,
      // isArchived: { $ne: true },
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
    const deletedItem = await Produce.findByIdAndDelete(id);

    if (!deletedItem) {
      return { success: false, error: "Item not found in database." };
    }

    revalidatePath("/farmer-dashboard");
    revalidatePath("/marketplace");
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
          activeListings: {
            $sum: {
              $cond: [{ $eq: ["$isPublished", true] }, 1, 0],
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

export async function publishProduceToBlockchain(produceId: string) {
  try {
    const produce = await Produce.findById(produceId);
    if (!produce) throw new Error("Produce not found");

    // 1. SET UI TO PROCESSING
    produce.blockchainStatus = "processing";
    await produce.save();
    revalidatePath("/produce");

    // 2. BLOCKCHAIN NOTARIZATION
    const contract = getAgroledgerContract();

    // Using your updated contract with 'syncedBy' and 'require' checks
    const tx = await contract.syncProduce(
      produce._id.toString(),
      produce.pricePerUnit,
      produce.quantity,
    );

    // Wait for Sepolia to confirm the transaction
    const receipt = await tx.wait();

    // 3. UPDATE UI TO PUBLISHED & SAVE SNAPSHOT
    produce.isPublished = true;
    produce.blockchainStatus = "published";
    produce.transactionHash = receipt.hash;
    produce.lastSyncedAt = new Date();

    // The "Memory" for future comparison
    produce.lastPublishedSnapshot = {
      pricePerUnit: produce.pricePerUnit,
      quantity: produce.quantity,
    };

    await produce.save();
    revalidatePath("/produce");
    revalidatePath("/marketplace");

    return { success: true, hash: receipt.hash };
  } catch (error: any) {
    console.error("Blockchain publish failed:", error);

    await Produce.findByIdAndUpdate(produceId, { blockchainStatus: "none" });
    revalidatePath("/dashboard/produce");

    return { success: false, error: error.message };
  }
}

export async function unpublishProduce(produceId: string) {
  try {
    await dbConnect();

    await Produce.findByIdAndUpdate(
      produceId,
      {
        isPublished: false,
        blockchainStatus: "none", // Reset status so they can publish again later
      },
      { new: true },
    );

    revalidatePath("/dashboard/produce");
    revalidatePath("/marketplace"); // Ensure the buyer sees it's gone!

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to unpublish" };
  }
}

export async function getAllMarketplaceProduce() {
  try {
    await dbConnect();
    const produce = await Produce.find({ isPublished: true })
      .sort({ updatedAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(produce));
  } catch (error) {
    console.error("Error fetching marketplace produce:", error);
    return [];
  }
}

export async function getProduceById(id: string) {
  try {
    await dbConnect();
    const produce = await Produce.findById(id).lean();
    return produce ? JSON.parse(JSON.stringify(produce)) : null;
  } catch (error) {
    console.error("Error fetching produce by ID:", error);
    return null;
  }
}

// lib/actions/produce.actions.ts

export async function getRelatedProduce(
  farmerId: string,
  category: string,
  currentProduceId: string,
) {
  try {
    await dbConnect();

    // 1. Try to find other items from the SAME FARMER first
    let related = await Produce.find({
      userId: farmerId,
      _id: { $ne: currentProduceId },
      isPublished: true,
    })
      .limit(4)
      .lean();

    // 2. FALLBACK: If the farmer has nothing else, find items in the SAME CATEGORY
    if (related.length === 0) {
      related = await Produce.find({
        category: category,
        _id: { $ne: currentProduceId },
        isPublished: true,
      })
        .limit(4)
        .lean();
    }

    return JSON.parse(JSON.stringify(related));
  } catch (error) {
    return [];
  }
}
