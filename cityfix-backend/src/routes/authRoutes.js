import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  getPendingStaffRequests,
  approveStaffRequest,
  rejectStaffRequest,
  changePassword
} from "../controllers/authController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/staff-requests", protect, authorizeRoles("admin"), getPendingStaffRequests);
router.patch("/staff-requests/:id/approve", protect, authorizeRoles("admin"), approveStaffRequest);
router.patch("/staff-requests/:id/reject", protect, authorizeRoles("admin"), rejectStaffRequest);
router.put("/change-password", protect, changePassword);

export default router;