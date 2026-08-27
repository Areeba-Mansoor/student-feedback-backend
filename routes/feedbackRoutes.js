import express from "express";
import {
  submitFeedback,
  getMyFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackForTrainer,
} from "../controllers/feedbackController.js";
import { protect, isStudent, isTrainer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isStudent, submitFeedback);
router.get("/my-feedback", protect, isStudent, getMyFeedback);
router.get("/trainer-feedback", protect, isTrainer, getFeedbackForTrainer);
router.put("/:id", protect, isStudent, updateFeedback);
router.delete("/:id", protect, isStudent, deleteFeedback);

export default router;