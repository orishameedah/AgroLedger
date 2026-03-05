jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));
jest.mock("@/models/Sales");
jest.mock("@/models/Produce");

import { createSale, updateSale } from "@/lib/actions/sales.actions";
import Sale from "@/models/Sales";
import Produce from "@/models/Produce";

describe("createSale", () => {
  it("should create sale successfully", async () => {
    (Produce.findById as jest.Mock).mockResolvedValue({
      produceId: "prod123",
      productName: "Tomato",
      category: "Vegetable",
      unit: "kg",
      totalQuantitySold: 2,
      totalAmountReceived: 200,
    });

    (Sale.create as jest.Mock).mockResolvedValue({});

    const result = await createSale("user123", {
      produceId: "prod123",
      totalQuantitySold: 2,
    });

    expect(result.success).toBe(true);
  });
});

describe("updateSale", () => {
  it("should return error if insufficient stock", async () => {
    (Sale.findById as jest.Mock).mockResolvedValue({
      produceId: "prod123",
      totalQuantitySold: 10,
    });

    (Produce.findById as jest.Mock).mockResolvedValue({
      quantity: 5,
      pricePerUnit: 100,
    });

    const result = await updateSale("sale123", {
      totalQuantitySold: 20,
    });

    expect(result.success).toBe(false);
  });
});
