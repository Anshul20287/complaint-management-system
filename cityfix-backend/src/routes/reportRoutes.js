import express from "express";

import {
  getReportOverview,
  getResolutionTime,
  exportComplaintsCSV
} from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin", "staff"));

router.get("/overview", getReportOverview);

router.get("/resolution-time", getResolutionTime);

router.get("/export-csv", exportComplaintsCSV);

export default router;