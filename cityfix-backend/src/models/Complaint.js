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
      enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "WORK_COMPLETED", "VERIFIED", "RESOLVED", "REJECTED"],
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
          enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "WORK_COMPLETED", "VERIFIED", "RESOLVED", "REJECTED"],
          required: true
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        role: {
          type: String,
          enum: ["citizen", "staff", "admin"],
          required: true
        },
        remark: {
          type: String
        },
        timestamp: {
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
    workProofImages: [
      {
        url: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: ["before", "after"],
          required: true
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    citizenVerification: {
      verified: {
        type: Boolean,
        default: false
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      verifiedAt: {
        type: Date
      },
      feedback: {
        type: String
      },
      rejected: {
        type: Boolean,
        default: false
      }
    },
    geoVerification: {
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      },
      verified: {
        type: Boolean,
        default: false
      },
      distance: {
        type: Number
      },
      flagged: {
        type: Boolean,
        default: false
      }
    },
    completedAt: {
      type: Date
    },
    verifiedAt: {
      type: Date
    },
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