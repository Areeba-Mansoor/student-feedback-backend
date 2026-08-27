import express from "express";
import {
  upload,
  updateProfile,
  updateProfilePic,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/profile-pic", protect, upload.single("profilePic"), updateProfilePic);
router.put("/change-password", protect, changePassword);

export default router;