import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM"
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN"
    },
    address: {
      type: String,
      required: true
    },
    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    imageUrl: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
          required: true
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    remarks: [
      {
        message: {
          type: String,
          required: true
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Complaint =
  mongoose.models.Complaint ||
  mongoose.model("Complaint", complaintSchema);

export default Complaint;