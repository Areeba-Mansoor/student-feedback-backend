import express from "express";
import {
  getAllUsers,
  assignRole,
  getAllFeedback,
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.put("/assign-role", protect, isAdmin, assignRole);
router.get("/feedback", protect, isAdmin, getAllFeedback);

export default router;