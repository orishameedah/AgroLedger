"use server";

import dbConnect from "@/lib/mongodb";
import Sale from "@/models/Sales";
import Produce from "@/models/Produce";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function createSale(userId: string, data: any) {
  try {
    await dbConnect();
    // 1. Snapshot the current state for history
    if (data.produceId) {
      const produce = await Produce.findById(data.produceId);
      if (produce) {
        data.stockBeforeSale = produce.quantity;
        data.valuationBeforeSale = produce.totalPrice;
        data.unitPriceAtCost = produce.pricePerUnit;
      }
    }
    await Sale.create({ ...data, userId });

    // 2. Machine Evaluation: Subtract Quantity
    if (data.produceId) {
      const newQty = Math.max(0, data.stockBeforeSale - data.totalQuantitySold);
      await Produce.findByIdAndUpdate(data.produceId, {
        quantity: newQty,
        totalPrice: newQty * data.unitPriceAtCost,
      });
    }

    revalidatePath("/farmer-dashboard");
    revalidatePath("/sales");
    revalidatePath("/produce");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * THE EDIT ACTION: This allows adding more buyers
 */
// export async function updateSale(saleId: string, newData: any) {
//   try {
//     await dbConnect();
//     const oldSale = await Sale.findById(saleId);
//     if (!oldSale) throw new Error("Not found");

//     if (oldSale.produceId) {
//       const produce = await Produce.findById(oldSale.produceId);
//       if (produce) {
//         // Step A: "Refund" the old total quantity back to stock
//         const restoredQty = produce.quantity + oldSale.totalQuantitySold;
//         // Step B: Subtract the NEW total (with the new buyers)
//         const finalQty = Math.max(
//           0,
//           restoredQty - Number(newData.totalQuantitySold)
//         );

//         await Produce.findByIdAndUpdate(oldSale.produceId, {
//           quantity: finalQty,
//           totalPrice: finalQty * produce.pricePerUnit,
//         });
//       }
//     }

//     await Sale.findByIdAndUpdate(saleId, newData);
//     revalidatePath("/sales");
//     revalidatePath("/produce");
//     return { success: true };
//   } catch (error) {
//     return { success: false };
//   }
// }

export async function updateSale(saleId: string, newData: any) {
  try {
    await dbConnect();
    const oldSale = await Sale.findById(saleId);
    if (!oldSale) throw new Error("Sale record not found");

    if (oldSale.produceId) {
      const produce = await Produce.findById(oldSale.produceId);
      if (produce) {
        // Step A: "Refund" the old total quantity back to temporary stock
        const restoredQty = produce.quantity + oldSale.totalQuantitySold;

        // Step B: Calculate what the final quantity WOULD be
        const newTotalSold = Number(newData.totalQuantitySold);

        // SIMPLE GUARD LOGIC: Check if the new sale exceeds total available stock
        if (newTotalSold > restoredQty) {
          return {
            success: false,
            error: `Insufficient stock. Only ${restoredQty} units available for this reconciliation.`,
          };
        }

        const finalQty = restoredQty - newTotalSold;

        // Step C: Update the Produce record with the new balance
        await Produce.findByIdAndUpdate(oldSale.produceId, {
          quantity: finalQty,
          totalPrice: finalQty * produce.pricePerUnit, // Recalculate valuation
        });
      }
    }

    // Step D: Update the Sale record with new buyer array and totals
    await Sale.findByIdAndUpdate(saleId, newData);

    revalidatePath("/sales");
    revalidatePath("/produce");
    revalidatePath("/farmer-dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update Sale Error:", error);
    return { success: false, error: "Database update failed" };
  }
}

export async function deleteSale(saleId: string) {
  try {
    await dbConnect();
    const sale = await Sale.findById(saleId);
    if (sale?.produceId) {
      const produce = await Produce.findById(sale.produceId);
      if (produce) {
        const restoredQty = produce.quantity + sale.totalQuantitySold;
        await Produce.findByIdAndUpdate(sale.produceId, {
          quantity: restoredQty,
          totalPrice: restoredQty * produce.pricePerUnit,
        });
      }
    }
    await Sale.findByIdAndDelete(saleId);
    revalidatePath("/sales");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function fetchSalesHistory(userId: string) {
  try {
    await dbConnect();
    return JSON.parse(
      JSON.stringify(
        await Sale.find({ userId: new mongoose.Types.ObjectId(userId) })
          .sort({ createdAt: -1 })
          .lean()
      )
    );
  } catch (error) {
    return [];
  }
}

export async function getTotalSales(userId: string) {
  try {
    await dbConnect();
    // Fetch all sales for this specific farmer
    const sales = await Sale.find({ userId });

    // Sum up the 'totalAmountReceived' field from every sale record
    const total = sales.reduce(
      (acc, sale) => acc + (sale.totalAmountReceived || 0),
      0
    );

    return { success: true, totalSales: total };
  } catch (error) {
    console.error("Total Sales Error:", error);
    return { success: false, totalSales: 0 };
  }
}
