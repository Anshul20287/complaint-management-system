import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

const getStatusCounts = async (filter = {}) => {
  const total = await Complaint.countDocuments(filter);
  const open = await Complaint.countDocuments({ ...filter, status: "OPEN" });
  const inProgress = await Complaint.countDocuments({ ...filter, status: "IN_PROGRESS" });
  const resolved = await Complaint.countDocuments({ ...filter, status: "RESOLVED" });
  const urgent = await Complaint.countDocuments({ ...filter, priority: "HIGH" });

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

    const staffUsers = await User.find({ role: "staff" })
      .select("name email address");

    const staffOverview = await Promise.all(
      staffUsers.map(async (staff) => {
        const [openAssigned, inProgressAssigned, resolvedAssigned] = await Promise.all([
          Complaint.countDocuments({ assignedTo: staff._id, status: "OPEN" }),
          Complaint.countDocuments({ assignedTo: staff._id, status: "IN_PROGRESS" }),
          Complaint.countDocuments({ assignedTo: staff._id, status: "RESOLVED" })
        ]);

        return {
          id: staff._id,
          name: staff.name,
          zone: staff.address || "Not specified",
          open: openAssigned + inProgressAssigned,
          resolved: resolvedAssigned
        };
      })
    );

    const [highPriorityOpen, unassignedOpen, staleUnresolved] = await Promise.all([
      Complaint.countDocuments({ priority: "HIGH", status: { $ne: "RESOLVED" } }),
      Complaint.countDocuments({ assignedTo: null, status: { $ne: "RESOLVED" } }),
      Complaint.countDocuments({
        status: { $ne: "RESOLVED" },
        createdAt: { $lte: new Date(Date.now() - 72 * 60 * 60 * 1000) }
      })
    ]);

    const alerts = [];
    if (highPriorityOpen > 0) {
      alerts.push({
        type: "warn",
        title: "High-priority unresolved complaints",
        time: "Live",
        meta: `${highPriorityOpen} high-priority complaints need attention`
      });
    }
    if (unassignedOpen > 0) {
      alerts.push({
        type: "warn",
        title: "Unassigned unresolved complaints",
        time: "Live",
        meta: `${unassignedOpen} complaints are not assigned to staff`
      });
    }
    if (staleUnresolved > 0) {
      alerts.push({
        type: "info",
        title: "Potential SLA breach risk",
        time: "Live",
        meta: `${staleUnresolved} complaints are older than 72 hours`
      });
    }

    const [citizenUsers, staffDirectoryUsers, complaintsByCitizen, unresolvedByStaff] = await Promise.all([
      User.find({ role: "citizen" })
        .select("name email createdAt")
        .sort({ createdAt: -1 }),
      User.find({ role: "staff" })
        .select("name address createdAt")
        .sort({ createdAt: -1 }),
      Complaint.aggregate([
        {
          $group: {
            _id: "$createdBy",
            complaints: { $sum: 1 }
          }
        }
      ]),
      Complaint.aggregate([
        {
          $match: {
            assignedTo: { $ne: null },
            status: { $ne: "RESOLVED" }
          }
        },
        {
          $group: {
            _id: "$assignedTo",
            active: { $sum: 1 }
          }
        }
      ])
    ]);

    const complaintCountByCitizenId = new Map(
      complaintsByCitizen.map((item) => [String(item._id), item.complaints])
    );

    const unresolvedCountByStaffId = new Map(
      unresolvedByStaff.map((item) => [String(item._id), item.active])
    );

    const citizensOverview = citizenUsers.map((citizen) => ({
      id: citizen._id,
      name: citizen.name,
      email: citizen.email,
      complaints: complaintCountByCitizenId.get(String(citizen._id)) || 0
    }));

    const staffDirectory = staffDirectoryUsers.map((staff) => ({
      id: staff._id,
      name: staff.name,
      zone: staff.address || "Not specified",
      active: unresolvedCountByStaffId.get(String(staff._id)) || 0
    }));

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
      categoryStats,
      staffOverview,
      alerts,
      citizensOverview,
      staffDirectory
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

    const categoryBreakdown = await Complaint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        assignedToMe: stats.total,
        resolved: stats.resolved,
        pending: stats.open + stats.inProgress
      },
      categoryBreakdown,
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