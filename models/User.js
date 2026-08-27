import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["pending", "student", "trainer", "admin"],
      default: "pending",
    },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    // Student-only fields
    course: { type: String, default: "", trim: true },
    batch: { type: String, default: "", trim: true },
    // Trainer-only fields
    specialization: { type: String, default: "", trim: true },
    experience: { type: String, default: "", trim: true },
    // Forgot Password fields
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);