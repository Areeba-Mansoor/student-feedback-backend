import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import sendEmail from "../utils/sendEmail.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["student", "trainer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    await sendEmail(
      user.email,
      "Role Assigned - Student Feedback System",
      `Hi ${user.name},\n\nYou have been assigned the role: ${role}.\nYou can now log in to your dashboard.\n\nRegards,\nAdmin`
    );

    res.status(200).json({ message: "Role assigned and email sent", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};