jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));
jest.mock("@/models/User");
jest.mock("@/models/FarmSetup");

import { updateFarmerSettings } from "@/lib/actions/user.actions";
import User from "@/models/User";
import Farm from "@/models/FarmSetup";

it("should update profile successfully for manual signup user", async () => {
  (User.findById as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({
      password: "hashedpassword123",
    }),
  });
  (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
  (Farm.findOneAndUpdate as jest.Mock).mockResolvedValue({});

  const result = await updateFarmerSettings("user123", {
    fullName: "Hameedah",
    username: "agroUser",
  });

  expect(result.success).toBe(true);
});

it("should not allow Google user to edit fullname", async () => {
  (User.findById as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({
      password: null,
    }),
  });
  const result = await updateFarmerSettings("user123", {
    fullName: "New Name",
    username: "newusername",
  });

  expect(result.success).toBe(false);
});
