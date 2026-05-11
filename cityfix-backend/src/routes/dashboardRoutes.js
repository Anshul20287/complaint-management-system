import express from "express";

import {
  getAdminDashboard,
  getStaffDashboard,
  getCitizenDashboard
} from "../controllers/dashboardController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);

router.get("/staff", protect, authorizeRoles("staff"), getStaffDashboard);

router.get("/citizen", protect, authorizeRoles("citizen"), getCitizenDashboard);

export default router;