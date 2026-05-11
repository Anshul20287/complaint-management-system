import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import createNotification from "../utils/createNotification.js";
import cloudinary from "../config/cloudinary.js";

const SUSPICIOUS_DISTANCE_THRESHOLD = 500; // 500 meters

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); // Distance in meters
}

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      address,
      latitude,
      longitude
    } = req.body;

    if (!title || !description || !category || !address || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details"
      });
    }

    let imageUrl = null;

    // Handle image upload to Cloudinary
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "complaints",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image to Cloudinary"
        });
      }
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      address,
      location: { latitude, longitude },
      imageUrl,
      createdBy: req.user._id,
      statusHistory: [
        {
          status: "OPEN",
          updatedBy: req.user._id,
          role: "citizen",
          remark: "Complaint created"
        }
      ]
    });

    await createNotification({
      user: req.user._id,
      complaint: complaint._id,
      title: "Complaint Submitted",
      message: `Your complaint "${complaint.title}" has been submitted successfully.`,
      type: "complaint_created"
    });

    const admins = await User.find({ role: "admin" }).select("_id");
    await Promise.allSettled(
      admins.map((admin) =>
        createNotification({
          user: admin._id,
          complaint: complaint._id,
          title: "New Complaint Registered",
          message: `Category: ${complaint.category} | ${complaint.title}`,
          type: "complaint_registered"
        })
      )
    );

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const queryObj = {};

    if (req.query.status) queryObj.status = req.query.status;
    if (req.query.category) queryObj.category = req.query.category;
    if (req.query.priority) queryObj.priority = req.query.priority;

    const complaints = await Complaint.find(queryObj)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("statusHistory.updatedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSingleComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("remarks.addedBy", "name email role")
      .populate("statusHistory.updatedBy", "name email role")
      .populate("citizenVerification.verifiedBy", "name email role");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStaffByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    // Find all approved staff members assigned to this category
    const staff = await User.find({
      role: "staff",
      staffApprovalStatus: "approved",
      assignedCategories: category
    }).select("_id name email assignedCategories");

    res.status(200).json({
      success: true,
      staff
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Validate that staff member exists and is approved
    const staff = await User.findById(staffId);
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found"
      });
    }

    if (staff.role !== "staff") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a staff member"
      });
    }

    if (staff.staffApprovalStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Staff member is not approved yet"
      });
    }

    // Validate that staff member has the required category
    if (!staff.assignedCategories.includes(complaint.category)) {
      return res.status(400).json({
        success: false,
        message: `Staff member is not assigned to the category: ${complaint.category}`
      });
    }

    complaint.assignedTo = staffId;
    complaint.status = "ASSIGNED";
    
    complaint.statusHistory.push({
      status: "ASSIGNED",
      updatedBy: req.user._id,
      role: "admin",
      remark: `Assigned to ${staff.name}`
    });

    await complaint.save();

    // Populate the assignedTo field before sending response
    await complaint.populate("assignedTo", "name email role");

    await createNotification({
      user: staffId,
      complaint: complaint._id,
      title: "New Complaint Assigned",
      message: `A new complaint "${complaint.title}" has been assigned to you.`,
      type: "assigned"
    });

    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: "Complaint Assigned",
      message: `Your complaint "${complaint.title}" has been assigned to municipal staff.`,
      type: "assigned"
    });

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const startWork = async (req, res) => {
  try {
    const { remark } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Only assigned staff can start work
    if (complaint.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this complaint"
      });
    }

    // Can only start from ASSIGNED or OPEN status
    if (!["ASSIGNED", "OPEN"].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot start work on complaint with status: ${complaint.status}`
      });
    }

    complaint.status = "IN_PROGRESS";
    complaint.statusHistory.push({
      status: "IN_PROGRESS",
      updatedBy: req.user._id,
      role: "staff",
      remark: remark || "Work started"
    });

    await complaint.save();

    // Notify citizen
    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: "Work Started",
      message: `Staff has started working on your complaint "${complaint.title}".`,
      type: "work_started"
    });

    res.status(200).json({
      success: true,
      message: "Work started successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const completeWork = async (req, res) => {
  try {
    const { remark, latitude, longitude } = req.body;
    const complaintId = req.params.id;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "GPS coordinates are required to complete work"
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Only assigned staff can complete work
    if (complaint.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this complaint"
      });
    }

    // Can only complete work from IN_PROGRESS status
    if (complaint.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: `Cannot complete work on complaint with status: ${complaint.status}`
      });
    }

    // Upload proof images if provided
    let proofImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "complaint-proof",
                resource_type: "auto"
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(file.buffer);
          });

          proofImages.push({
            url: result.secure_url,
            type: file.fieldname === "beforeImages" ? "before" : "after"
          });
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
        }
      }
    }

    // Calculate geo distance
    const complaintLat = complaint.location.latitude;
    const complaintLon = complaint.location.longitude;
    const staffLat = parseFloat(latitude);
    const staffLon = parseFloat(longitude);

    const distance = calculateDistance(complaintLat, complaintLon, staffLat, staffLon);
    const flagged = distance > SUSPICIOUS_DISTANCE_THRESHOLD;

    complaint.status = "WORK_COMPLETED";
    complaint.completedAt = new Date();
    complaint.workProofImages = [...(complaint.workProofImages || []), ...proofImages];
    complaint.geoVerification = {
      latitude: staffLat,
      longitude: staffLon,
      distance,
      flagged
    };

    complaint.statusHistory.push({
      status: "WORK_COMPLETED",
      updatedBy: req.user._id,
      role: "staff",
      remark: remark || "Work completed"
    });

    await complaint.save();

    // Notify citizen
    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: "Work Completed",
      message: `Staff has completed work on your complaint "${complaint.title}". Please verify the work.`,
      type: "work_completed"
    });

    // Notify admin if GPS is suspicious
    if (flagged) {
      const admins = await User.find({ role: "admin" }).select("_id");
      await Promise.allSettled(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            complaint: complaint._id,
            title: "Suspicious GPS Detected",
            message: `Staff completed work ${distance}m away from complaint location. Please review.`,
            type: "suspicious_gps"
          })
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Work completed successfully",
      complaint,
      geoData: {
        distance,
        flagged
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyCitizen = async (req, res) => {
  try {
    const { verified, feedback } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Only citizen who created complaint can verify
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the complaint creator can verify work"
      });
    }

    // Can only verify from WORK_COMPLETED status
    if (complaint.status !== "WORK_COMPLETED") {
      return res.status(400).json({
        success: false,
        message: `Cannot verify complaint with status: ${complaint.status}`
      });
    }

    if (verified) {
      // Mark as verified and resolved
      complaint.status = "VERIFIED";
      complaint.verifiedAt = new Date();
      complaint.citizenVerification = {
        verified: true,
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        feedback: feedback || ""
      };

      complaint.statusHistory.push({
        status: "VERIFIED",
        updatedBy: req.user._id,
        role: "citizen",
        remark: "Work verified by citizen"
      });

      // Auto resolve after citizen verification
      complaint.status = "RESOLVED";
      complaint.resolvedAt = new Date();

      complaint.statusHistory.push({
        status: "RESOLVED",
        updatedBy: req.user._id,
        role: "citizen",
        remark: "Complaint resolved"
      });

      await createNotification({
        user: complaint.assignedTo,
        complaint: complaint._id,
        title: "Complaint Verified",
        message: `Your work on complaint "${complaint.title}" has been verified and resolved.`,
        type: "work_verified"
      });

      const admins = await User.find({ role: "admin" }).select("_id");
      await Promise.allSettled(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            complaint: complaint._id,
            title: "Complaint Resolved",
            message: `Complaint "${complaint.title}" has been resolved by citizen.`,
            type: "complaint_resolved"
          })
        )
      );
    } else {
      // Reject and send back to IN_PROGRESS
      complaint.status = "IN_PROGRESS";
      complaint.citizenVerification = {
        verified: false,
        verifiedBy: req.user._id,
        verifiedAt: new Date(),
        feedback: feedback || "Work not satisfactory",
        rejected: true
      };

      complaint.statusHistory.push({
        status: "IN_PROGRESS",
        updatedBy: req.user._id,
        role: "citizen",
        remark: `Rejected: ${feedback || "Work not satisfactory"}`
      });

      await createNotification({
        user: complaint.assignedTo,
        complaint: complaint._id,
        title: "Work Rejected",
        message: `Your work on complaint "${complaint.title}" was not verified. Please re-do the work.`,
        type: "work_rejected"
      });

      const admins = await User.find({ role: "admin" }).select("_id");
      await Promise.allSettled(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            complaint: complaint._id,
            title: "Work Rejected by Citizen",
            message: `Complaint "${complaint.title}" - citizen rejected work. Reason: ${feedback || "Not specified"}`,
            type: "work_rejected"
          })
        )
      );
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: verified ? "Complaint verified successfully" : "Work rejected, complaint reopened",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const rejectUpdate = async (req, res) => {
  try {
    const { reason } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Only admin can reject updates
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can reject updates"
      });
    }

    // Can only reject from WORK_COMPLETED status
    if (complaint.status !== "WORK_COMPLETED") {
      return res.status(400).json({
        success: false,
        message: `Cannot reject complaint with status: ${complaint.status}`
      });
    }

    complaint.status = "REJECTED";
    complaint.statusHistory.push({
      status: "REJECTED",
      updatedBy: req.user._id,
      role: "admin",
      remark: reason || "Update rejected by admin"
    });

    await complaint.save();

    // Notify staff
    await createNotification({
      user: complaint.assignedTo,
      complaint: complaint._id,
      title: "Update Rejected",
      message: `Your work update on complaint "${complaint.title}" was rejected by admin. Reason: ${reason || "Not specified"}`,
      type: "update_rejected"
    });

    // Notify citizen
    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: "Invalid Update Detected",
      message: `An invalid update was detected and rejected by admin. We will reassign the complaint.`,
      type: "update_rejected"
    });

    res.status(200).json({
      success: true,
      message: "Update rejected successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaintTimeline = async (req, res) => {
  try {
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .populate("statusHistory.updatedBy", "name email role")
      .populate("citizenVerification.verifiedBy", "name email role")
      .populate("remarks.addedBy", "name email role");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Build comprehensive timeline
    const timeline = [];

    // Add creation event
    timeline.push({
      type: "created",
      timestamp: complaint.createdAt,
      actor: complaint.createdBy,
      role: "citizen",
      description: "Complaint created",
      data: { title: complaint.title, category: complaint.category }
    });

    // Add status history
    complaint.statusHistory.forEach((entry) => {
      timeline.push({
        type: "status_change",
        timestamp: entry.timestamp,
        actor: entry.updatedBy,
        role: entry.role,
        status: entry.status,
        remark: entry.remark,
        description: `Status changed to ${entry.status}`
      });
    });

    // Add remarks
    complaint.remarks.forEach((remark) => {
      timeline.push({
        type: "remark",
        timestamp: remark.createdAt,
        actor: remark.addedBy,
        description: "Remark added",
        message: remark.message
      });
    });

    // Add proof images info
    if (complaint.workProofImages && complaint.workProofImages.length > 0) {
      timeline.push({
        type: "proof_uploaded",
        timestamp: complaint.completedAt,
        actor: complaint.assignedTo,
        role: "staff",
        description: `${complaint.workProofImages.length} proof images uploaded`,
        proofCount: complaint.workProofImages.length
      });
    }

    // Add verification if done
    if (complaint.citizenVerification && complaint.citizenVerification.verifiedAt) {
      timeline.push({
        type: "verification",
        timestamp: complaint.citizenVerification.verifiedAt,
        actor: complaint.citizenVerification.verifiedBy,
        role: "citizen",
        status: complaint.citizenVerification.verified ? "VERIFIED" : "REJECTED",
        description: complaint.citizenVerification.verified ? "Work verified" : "Work rejected",
        feedback: complaint.citizenVerification.feedback
      });
    }

    // Sort by timestamp
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.status(200).json({
      success: true,
      complaint: {
        id: complaint._id,
        title: complaint.title,
        status: complaint.status,
        createdBy: complaint.createdBy,
        assignedTo: complaint.assignedTo,
        location: complaint.location,
        address: complaint.address,
        priority: complaint.priority,
        category: complaint.category,
        geoVerification: complaint.geoVerification
      },
      timeline
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStaffAssignedComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    const staffId = req.user._id;

    const filter = {
      assignedTo: staffId
    };

    // If category is provided, filter by that category
    if (category) {
      filter.category = decodeURIComponent(category);
    }

    // If status is provided, filter by that status
    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    // Get statistics
    const stats = {
      total: complaints.length,
      open: complaints.filter(c => c.status === "OPEN").length,
      assigned: complaints.filter(c => c.status === "ASSIGNED").length,
      inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
      workCompleted: complaints.filter(c => c.status === "WORK_COMPLETED").length,
      resolved: complaints.filter(c => c.status === "RESOLVED").length,
      urgent: complaints.filter(c => c.priority === "HIGH").length
    };

    res.status(200).json({
      success: true,
      stats,
      complaints
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addComplaintRemark = async (req, res) => {
  try {
    const { message } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    complaint.remarks.push({
      message,
      addedBy: req.user._id
    });

    await complaint.save();

    // Notify other parties
    const notifyUser = complaint.assignedTo && complaint.assignedTo.toString() !== req.user._id.toString()
      ? complaint.assignedTo
      : complaint.createdBy;

    await createNotification({
      user: notifyUser,
      complaint: complaint._id,
      title: "New Remark Added",
      message: `A new remark has been added to complaint "${complaint.title}".`,
      type: "remark_added"
    });

    res.status(200).json({
      success: true,
      message: "Remark added successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaintHeatmap = async (req, res) => {
  try {
    const queryObj = {};

    if (req.query.category) queryObj.category = req.query.category;
    if (req.query.status) queryObj.status = req.query.status;
    if (req.query.priority) queryObj.priority = req.query.priority;

    // If not authenticated (public endpoint), only show resolved complaints
    if (!req.user) {
      queryObj.status = "RESOLVED";
    }

    const complaints = await Complaint.find({
      ...queryObj,
      "location.latitude": { $exists: true, $ne: null },
      "location.longitude": { $exists: true, $ne: null }
    })
      .select("title category status priority address location createdAt geoVerification")
      .sort({ createdAt: -1 });

    const heatmapData = complaints.map((complaint) => ({
      id: complaint._id,
      title: complaint.title,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority,
      address: complaint.address,
      latitude: complaint.location.latitude,
      longitude: complaint.location.longitude,
      createdAt: complaint.createdAt,
      geoFlagged: complaint.geoVerification?.flagged || false
    }));

    res.status(200).json({
      success: true,
      count: heatmapData.length,
      heatmapData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      priority,
      address,
      latitude,
      longitude
    } = req.body;

    // Find the complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    // Check if the complaint belongs to the user
    if (complaint.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own complaints"
      });
    }

    // Check if complaint is still editable (within 3 minutes)
    const now = new Date();
    const createdAt = new Date(complaint.createdAt);
    const timeDiff = (now - createdAt) / (1000 * 60); // in minutes

    if (timeDiff > 3) {
      return res.status(400).json({
        success: false,
        message: "Complaint can only be edited within 3 minutes of creation"
      });
    }

    // Check if complaint is still in editable status
    if (complaint.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Complaint can only be edited when status is OPEN"
      });
    }

    // Update fields
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (priority) complaint.priority = priority;
    if (address) complaint.address = address;
    if (latitude && longitude) {
      complaint.location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "complaints",
              resource_type: "auto"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        complaint.imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload image to Cloudinary"
        });
      }
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getSingleComplaint,
  getStaffByCategory,
  assignComplaint,
  startWork,
  completeWork,
  verifyCitizen,
  rejectUpdate,
  getComplaintTimeline,
  getStaffAssignedComplaints,
  addComplaintRemark,
  getComplaintHeatmap,
  updateComplaint
};