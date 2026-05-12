import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getSingleComplaint,
  assignComplaint,
  startWork,
  completeWork,
  verifyCitizen,
  rejectUpdate,
  getComplaintTimeline,
  getStaffByCategory,
  getStaffAssignedComplaints,
  addComplaintRemark,
  getComplaintHeatmap,
  updateComplaint
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

router.put(
  "/:id",
  protect,
  authorizeRoles("citizen"),
  upload.single("image"),
  updateComplaint
);

router.get(
  "/assigned/list",
  protect,
  authorizeRoles("staff"),
  getStaffAssignedComplaints
);

router.get(
  "/heatmap",
  protect,
  authorizeRoles("citizen","admin", "staff"),
  getComplaintHeatmap
);

router.get(
  "/public-heatmap",
  getComplaintHeatmap
);

router.get(
  "/staff/by-category/:category",
  protect,
  authorizeRoles("admin"),
  getStaffByCategory
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
  "/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignComplaint
);

router.put(
  "/:id/start-work",
  protect,
  authorizeRoles("staff"),
  startWork
);

router.put(
  "/:id/complete-work",
  protect,
  authorizeRoles("staff"),
  upload.array("proofImages", 10),
  completeWork
);

router.put(
  "/:id/verify",
  protect,
  authorizeRoles("citizen", "admin"),
  verifyCitizen
);

router.put(
  "/:id/reject-update",
  protect,
  authorizeRoles("admin"),
  rejectUpdate
);

router.get(
  "/:id/timeline",
  protect,
  getComplaintTimeline
);

router.put(
  "/:id/remarks",
  protect,
  authorizeRoles("admin", "staff", "citizen"),
  addComplaintRemark
);

export default router;