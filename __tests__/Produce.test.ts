jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock external dependencies
jest.mock("@/models/Produce");
jest.mock("@/lib/blockchain/provider");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.spyOn(console, "error").mockImplementation(() => {});

import {
  saveProduce,
  deleteProduce,
  publishProduceToBlockchain,
} from "@/lib/actions/produce.actions";

import Produce from "@/models/Produce";
import { getAgroledgerContract } from "@/lib/blockchain/provider";

describe("saveProduce - Create", () => {
  it("should create produce successfully", async () => {
    (Produce.create as jest.Mock).mockResolvedValue({});

    const data = {
      name: "Maize",
      category: "Grain",
      quantity: "10",
      unit: "kg",
      pricePerUnit: "500",
    };

    const result = await saveProduce(data, "user123");

    expect(result.success).toBe(true);
    expect(Produce.create).toHaveBeenCalled();
  });
});

describe("saveProduce - Update", () => {
  it("should update produce if ID exists", async () => {
    (Produce.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const data = {
      id: "abc123",
      name: "Rice",
      quantity: "5",
      pricePerUnit: "300",
    };

    const result = await saveProduce(data, "user123");

    expect(result.success).toBe(true);
    expect(Produce.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe("deleteProduce", () => {
  it("should delete produce successfully", async () => {
    (Produce.findByIdAndDelete as jest.Mock).mockResolvedValue({});

    const result = await deleteProduce("abc123");

    expect(result.success).toBe(true);
  });

  it("should return error if produce not found", async () => {
    (Produce.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await deleteProduce("wrongId");

    expect(result.success).toBe(false);
  });
});

describe("publishProduceToBlockchain - Success", () => {
  it("should publish and update isPublished", async () => {
    const mockSave = jest.fn();
    const mockProduce = {
      _id: "123",
      pricePerUnit: 500,
      quantity: 2,
      save: mockSave,
    };

    (Produce.findById as jest.Mock).mockResolvedValue(mockProduce);

    const mockWait = jest.fn().mockResolvedValue({ hash: "0x123" });

    (getAgroledgerContract as jest.Mock).mockReturnValue({
      syncProduce: jest.fn().mockResolvedValue({
        wait: mockWait,
      }),
    });

    const result = await publishProduceToBlockchain("123");

    expect(result.success).toBe(true);
    expect(mockSave).toHaveBeenCalled();
  });
});

describe("publishProduceToBlockchain - Failure", () => {
  it("should return error if produce not found", async () => {
    (Produce.findById as jest.Mock).mockResolvedValue(null);

    const result = await publishProduceToBlockchain("wrong");

    expect(result.success).toBe(false);
  });
});
