import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false, // Prevents password from being returned in general queries for security
    },
    role: {
      type: String,
      enum: ["farmer", "buyer"],
      default: "buyer",
    },
    isSetupComplete: {
      type: Boolean,
      default: false, // Farmers start as 'false' until they complete the Farm Setup
    },
    image: {
      type: String, // Stores Google Profile picture if they use Google Auth
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// This export pattern is vital for Next.js to prevent re-compiling the model
const User = models.User || model("User", UserSchema);

export default User;
