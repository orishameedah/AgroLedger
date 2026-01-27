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

    return { success: true, hash: receipt.hash };
  } catch (error: any) {
    console.error("Blockchain publish failed:", error);

    // ROLLBACK: Reset UI so the farmer can try again
    await Produce.findByIdAndUpdate(produceId, { blockchainStatus: "none" });
    revalidatePath("/dashboard/produce");

    return { success: false, error: error.message };
  }
}

// lib/actions/produce.actions.ts
export async function unpublishProduce(produceId: string) {
  try {
    await dbConnect();

    const result = await Produce.findByIdAndUpdate(
      produceId,
      {
        isPublished: false,
        blockchainStatus: "none", // Reset status so they can publish again later
        // We keep the lastSyncedAt and transactionHash for history/records
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

// lib/actions/produce.actions.ts
// lib/actions/produce.actions.ts

export async function fetchAllBlockchainData(idList: string[]) {
  try {
    const contract = getAgroledgerContract();

    // We loop through the IDs and call getListing for each one
    const blockchainRecords = await Promise.all(
      idList.map(async (id) => {
        // CALLING YOUR SMART CONTRACT FUNCTION HERE
        const data = await contract.getListing(id);

        // If syncedBy is the "Zero Address", the item hasn't been notarized yet
        const isNotarized =
          data.syncedBy !== "0x0000000000000000000000000000000000000000";

        return {
          id,
          price: Number(data.price),
          quantity: Number(data.quantity),
          syncedBy: data.syncedBy,
          // Converting Solidity timestamp to JS Date
          timestamp: data.timestamp ? Number(data.timestamp) * 1000 : null,
          isNotarized,
        };
      }),
    );

    return { success: true, records: blockchainRecords };
  } catch (error) {
    console.error("Ledger Read Error:", error);
    return { success: false, error: "Failed to read the smart contract." };
  }
}

export async function getAllProduceIds() {
  try {
    await dbConnect();
    // We only select the _id field to keep it fast and avoid CastErrors
    const produce = await Produce.find({}, { _id: 1 });
    return { success: true, ids: produce.map((p) => p._id.toString()) };
  } catch (e) {
    return { success: false, ids: [] };
  }
}
