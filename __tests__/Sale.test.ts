jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/models/Sales");
jest.mock("@/models/Produce");

import { createSale } from "@/lib/actions/sales.actions";
import Sale from "@/models/Sales";
import Produce from "@/models/Produce";

describe("Sales Creation", () => {
  it("Manual Sales creation", async () => {
    (Sale.create as jest.Mock).mockResolvedValue({});

    const result = await createSale("user123", {
      productName: "Cashew",
      category: "Crops",
      unit: "tons",
      produceId: null,
      buyers: [
        { name: "Ana", quantity: 30, amountSold: 23500 },
        { name: "Khadijat", quantity: 23, amountSold: 15000 },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("Automatic Sales Creation", async () => {
    (Produce.findById as jest.Mock).mockResolvedValue({
      _id: "prod123",
      productName: "Cow",
      category: "Livestock",
      unit: "heads",
      quantity: 20,
      pricePerUnit: 198980,
    });

    (Sale.create as jest.Mock).mockResolvedValue({});

    const result = await createSale("user123", {
      produceId: "prod123",
      buyers: [
        { name: "Ade", quantity: 10, amountSold: 167900 },
        { name: "Deji", quantity: 10, amountSold: 178900 },
      ],
    });

    expect(result.success).toBe(true);
  });
});
