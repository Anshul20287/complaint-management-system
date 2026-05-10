import Complaint from "../models/Complaint.js";
import createNotification from "../utils/createNotification.js";
import cloudinary from "../config/cloudinary.js";

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
          updatedBy: req.user._id
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
      .populate("statusHistory.updatedBy", "name email role");

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

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status"
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    complaint.status = status;

    complaint.statusHistory.push({
      status,
      updatedBy: req.user._id
    });

    if (status === "RESOLVED") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: status === "RESOLVED" ? "Complaint Resolved" : "Complaint Status Updated",
      message:
        status === "RESOLVED"
          ? `Your complaint "${complaint.title}" has been resolved.`
          : `Your complaint "${complaint.title}" is now ${status}.`,
      type: status === "RESOLVED" ? "resolved" : "status_changed"
    });

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint
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

    complaint.assignedTo = staffId;

    await complaint.save();

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

    await createNotification({
      user: complaint.createdBy,
      complaint: complaint._id,
      title: "New Remark Added",
      message: `A new remark has been added to your complaint "${complaint.title}".`,
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

    const complaints = await Complaint.find({
      ...queryObj,
      "location.latitude": { $exists: true, $ne: null },
      "location.longitude": { $exists: true, $ne: null }
    })
      .select("title category status priority address location createdAt")
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
      createdAt: complaint.createdAt
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