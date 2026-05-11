import Complaint from "../models/Complaint.js";
import { Parser } from "json2csv";

// GET /api/reports/overview
export const getReportOverview = async (req, res) => {
  try {
    const [byStatus, byCategory, byPriority, trend] = await Promise.all([
      Complaint.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      Complaint.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        }
      ]),

      Complaint.aggregate([
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 }
          }
        }
      ]),

      Complaint.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt"
              }
            },
            submitted: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ])
    ]);

    res.status(200).json({
      success: true,
      reports: {
        byStatus,
        byCategory,
        byPriority,
        trend
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/reports/resolution-time
export const getResolutionTime = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $match: {
          status: "RESOLVED",
          resolvedAt: { $ne: null }
        }
      },
      {
        $project: {
          category: 1,
          resolveHours: {
            $divide: [
              { $subtract: ["$resolvedAt", "$createdAt"] },
              3600000
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          avgHours: { $avg: "$resolveHours" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgHours: 1 } }
    ]);

    res.status(200).json({
      success: true,
      resolutionTime: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// NEW: GET /api/reports/export-csv
export const exportComplaintsCSV = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    const formattedData = complaints.map((complaint) => ({
      Title: complaint.title,
      Description: complaint.description,
      Category: complaint.category,
      Priority: complaint.priority,
      Status: complaint.status,
      Address: complaint.address,
      Latitude: complaint.location?.latitude || "",
      Longitude: complaint.location?.longitude || "",
      CitizenName: complaint.createdBy?.name || "N/A",
      CitizenEmail: complaint.createdBy?.email || "N/A",
      AssignedStaff: complaint.assignedTo?.name || "Not Assigned",
      CreatedAt: complaint.createdAt,
      ResolvedAt: complaint.resolvedAt || "Not Resolved"
    }));

    const parser = new Parser();
    const csv = parser.parse(formattedData);

    res.header("Content-Type", "text/csv");
    res.attachment("complaints-report.csv");

    return res.send(csv);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};