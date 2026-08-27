import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const submitFeedback = async (req, res) => {
  try {
    const { trainerName, message } = req.body;

    if (!trainerName || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      trainerName,
      message,
    });

    // Notify the trainer (best-effort — email failure should not block the response)
    try {
      const trainer = await User.findOne({ name: trainerName, role: "trainer" });
      if (trainer?.email) {
        await sendEmail(
          trainer.email,
          "New Feedback Received - OneHub",
          `Hi ${trainer.name},\n\n${req.user.name} submitted new feedback for you:\n\n"${message}"\n\nLogin to OneHub to view details.`
        );
      }
    } catch (err) {
      console.error("Trainer email failed:", err.message);
    }

    // Notify all admins
    try {
      const admins = await User.find({ role: "admin" });
      for (const admin of admins) {
        await sendEmail(
          admin.email,
          "New Feedback Submitted - OneHub",
          `Hi ${admin.name},\n\n${req.user.name} submitted feedback for trainer ${trainerName}:\n\n"${message}"`
        );
      }
    } catch (err) {
      console.error("Admin email failed:", err.message);
    }

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update own feedback
export const updateFeedback = async (req, res) => {
  try {
    const { trainerName, message } = req.body;

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this feedback" });
    }

    if (trainerName) feedback.trainerName = trainerName;
    if (message) feedback.message = message;

    await feedback.save();

    res.status(200).json({ message: "Feedback updated", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete own feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this feedback" });
    }

    await feedback.deleteOne();

    res.status(200).json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all feedback submitted for the logged-in trainer
export const getFeedbackForTrainer = async (req, res) => {
  try {
    const feedback = await Feedback.find({ trainerName: req.user.name })
      .populate("student", "name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};