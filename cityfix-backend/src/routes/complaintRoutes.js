import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getSingleComplaint,
  updateComplaintStatus,
  assignComplaint,
  addComplaintRemark,
  getComplaintHeatmap
} from "../controllers/complaintController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("citizen"),
  upload.single("image"),
  createComplaint
);

router.get(
  "/my",
  protect,
  authorizeRoles("citizen"),
  getMyComplaints
);

router.get(
  "/heatmap",
  protect,
  authorizeRoles("citizen","admin", "staff"),
  getComplaintHeatmap
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "staff"),
  getAllComplaints
);

router.get(
  "/:id",
  protect,
  getSingleComplaint
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin", "staff"),
  updateComplaintStatus
);

router.put(
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignComplaint
);

router.put(
  "/:id/remarks",
  protect,
  authorizeRoles("admin", "staff"),
  addComplaintRemark
);

export default router;