import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

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
      assignedCategories:
        role === "staff" ? assignedCategories || [] : [],
      phone: phone || "",
      address: address || ""
    });

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
        address: user.address
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
        address: user.address
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