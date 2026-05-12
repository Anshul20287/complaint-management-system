import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import createNotification from "../utils/createNotification.js";

const validRoles = ["citizen", "staff", "admin"];

const validCategories = [
  "Pothole/Road Damage",
  "Sanitation",
  "Electricity",
  "Water Problems",
  "Environmental factors",
  "Other"
];

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      assignedCategories,
      phone,
      address
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be citizen, staff or admin"
      });
    }

    if (assignedCategories && !Array.isArray(assignedCategories)) {
      return res.status(400).json({
        success: false,
        message: "assignedCategories must be an array"
      });
    }

    if (assignedCategories) {
      const invalidCategory = assignedCategories.find(
        (category) => !validCategories.includes(category)
      );

      if (invalidCategory) {
        return res.status(400).json({
          success: false,
          message: `${invalidCategory} is not a valid assigned category`
        });
      }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "citizen",
      staffApprovalStatus: role === "staff" ? "pending" : "approved",
      assignedCategories:
        role === "staff" ? assignedCategories || [] : [],
      phone: phone || "",
      address: address || ""
    });

    if (user.role === "staff") {
      const admins = await User.find({ role: "admin" }).select("_id");
      await Promise.allSettled(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            title: "Pending Staff Approval Request",
            message: `${user.name} (${user.email}) requested staff access.`,
            type: "staff_approval_request",
            meta: {
              staffId: user._id,
              staffName: user.name,
              staffEmail: user.email
            }
          })
        )
      );
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedCategories: user.assignedCategories,
        phone: user.phone,
        address: user.address,
        staffApprovalStatus: user.staffApprovalStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.role === "staff" && user.staffApprovalStatus === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your staff account is pending admin approval"
      });
    }

    if (user.role === "staff" && user.staffApprovalStatus === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your staff account request was rejected by admin"
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedCategories: user.assignedCategories,
        phone: user.phone,
        address: user.address,
        staffApprovalStatus: user.staffApprovalStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

export const getPendingStaffRequests = async (req, res) => {
  try {
    const pendingStaff = await User.find({
      role: "staff",
      staffApprovalStatus: "pending"
    })
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingStaff.length,
      requests: pendingStaff.map((staff) => ({
        id: staff._id,
        name: staff.name,
        email: staff.email,
        createdAt: staff.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const approveStaffRequest = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "staff"
      },
      { staffApprovalStatus: "approved" },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff user not found"
      });
    }

    await createNotification({
      user: staff._id,
      title: "Staff Account Approved",
      message: "Your staff account has been approved by admin.",
      type: "staff_approved"
    });

    res.status(200).json({
      success: true,
      message: "Staff request approved",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        staffApprovalStatus: staff.staffApprovalStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const rejectStaffRequest = async (req, res) => {
  try {
    const staff = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "staff"
      },
      { staffApprovalStatus: "rejected" },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff user not found"
      });
    }

    await createNotification({
      user: staff._id,
      title: "Staff Account Rejected",
      message: "Your staff account request was rejected by admin.",
      type: "staff_rejected"
    });

    res.status(200).json({
      success: true,
      message: "Staff request rejected",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        staffApprovalStatus: staff.staffApprovalStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if current password is correct
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};