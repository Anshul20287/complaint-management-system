import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint"
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        "complaint_created",
        "complaint_registered",
        "assigned",
        "status_changed",
        "resolved",
        "overdue",
        "remark_added",
        "user_registered",
        "staff_approval_request",
        "staff_approved",
        "staff_rejected",
        "work_started",
        "work_completed",
        "work_verified",
        "work_rejected",
        "suspicious_gps",
        "update_rejected"
      ],
      required: true
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;