// import mongoose from "mongoose";

// const FarmSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   phoneNumber: { type: String, required: true },
//   farmName: { type: String, required: true },
//   //   farmTypes: {
//   //     type: [String],
//   //     validate: [(val) => val.length <= 5, "Max 5 types allowed"],
//   //   },
//   //   locations: {
//   //     type: [String],
//   //     validate: [(val) => val.length <= 5, "Max 5 locations allowed"],
//   //   },
//   farmTypes: {
//     type: [String],
//     validate: [(val: string[]) => val.length <= 5, "Max 5 types allowed"],
//   },
//   locations: {
//     type: [String],
//     validate: [(val: string[]) => val.length <= 5, "Max 5 locations allowed"],
//   },

//   availability: {
//     start: String, // e.g., "08:00"
//     end: String, // e.g., "17:00"
//     days: [String], // e.g., ["Monday", "Tuesday"]
//   },
// });

// export default mongoose.models.Farm || mongoose.model("Farm", FarmSchema);

import mongoose from "mongoose";

const FarmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One farm per user account
    },
    phoneNumber: { type: String, required: true },
    farmName: { type: String, required: true },
    // Storing as arrays allows for the "Multiple Selection" (up to 5)
    farmTypes: {
      type: [String],
      validate: [
        (v: string[]) => v.length <= 5,
        "Maximum of 5 farm types allowed",
      ],
    },
    locations: {
      type: [String],
      validate: [
        (v: string[]) => v.length <= 5,
        "Maximum of 5 locations allowed",
      ],
    },
    // Communication preferences
    availability: {
      startTime: { type: String, default: "08:00" },
      endTime: { type: String, default: "17:00" },
      days: {
        type: [String],
        // Now including the full week
        default: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Farm || mongoose.model("Farm", FarmSchema);
