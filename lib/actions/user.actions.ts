"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Farm from "@/models/FarmSetup";
import { revalidatePath } from "next/cache";

/**
 * Fetches data from both User and Farm models and merges them
 */
export async function getFarmerSettings(userId: string) {
  try {
    await dbConnect();

    const user = await User.findById(userId).lean();
    const farm = await Farm.findOne({ userId }).lean();

    return {
      fullName: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: farm?.phoneNumber || "",
      farmName: farm?.farmName || "",
      farmTypes: farm?.farmTypes || [],
      locations: farm?.locations || [],
      availability: {
        startTime: farm?.availability?.startTime || "08:00",
        endTime: farm?.availability?.endTime || "17:00",
        days: farm?.availability?.days || [],
      },
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw new Error("Failed to load profile data");
  }
}

/**
 * Updates both collections in a single operation
 */
export async function updateFarmerSettings(userId: string, data: any) {
  try {
    await dbConnect();

    // 1. Update User Profile (Basic Info)
    await User.findByIdAndUpdate(userId, {
      name: data.fullName,
      username: data.username,
    });

    // 2. Update Farm Profile (Deep Settings)
    await Farm.findOneAndUpdate(
      { userId },
      {
        phoneNumber: data.phone,
        farmName: data.farmName,
        farmTypes: data.farmTypes,
        locations: data.locations,
        availability: data.availability,
      },
      { upsert: true }, // Create if missing
    );

    revalidatePath("/farmer-dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Database update failed" };
  }
}

export async function getFarmerCategories(userId: string) {
  await dbConnect();
  const farm = await Farm.findOne({ userId }).select("farmTypes");
  return farm?.farmTypes || [];
}
