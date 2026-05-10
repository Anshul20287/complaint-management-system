import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

const getStatusCounts = async (filter = {}) => {
  const total = await Complaint.countDocuments(filter);
  const open = await Complaint.countDocuments({ ...filter, status: "OPEN" });
  const inProgress = await Complaint.countDocuments({ ...filter, status: "IN_PROGRESS" });
  const resolved = await Complaint.countDocuments({ ...filter, status: "RESOLVED" });
  const urgent = await Complaint.countDocuments({ ...filter, priority: "High" });

  return { total, open, inProgress, resolved, urgent };
};

export const getAdminDashboard = async (req, res) => {
  try {
    const stats = await getStatusCounts();

    const totalCitizens = await User.countDocuments({ role: "citizen" });
    const totalStaff = await User.countDocuments({ role: "staff" });

    const recentComplaints = await Complaint.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalIssues: stats.total,
        resolved: stats.resolved,
        pending: stats.open + stats.inProgress,
        escalated: stats.urgent,
        totalCitizens,
        totalStaff
      },
      recentComplaints,
      categoryStats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStaffDashboard = async (req, res) => {
  try {
    const filter = { assignedTo: req.user._id };

    const stats = await getStatusCounts(filter);

    const assignedIssues = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        assignedToMe: stats.total,
        resolved: stats.resolved,
        pending: stats.open + stats.inProgress
      },
      assignedIssues
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCitizenDashboard = async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };

    const stats = await getStatusCounts(filter);

    const myRecentIssues = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        myReports: stats.total,
        resolved: stats.resolved,
        pending: stats.open + stats.inProgress
      },
      myRecentIssues
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};