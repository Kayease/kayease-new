import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { generateToken, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user (default role EMPLOYEE when available)
    let defaultRoles = [];
    const employeeRole = await Role.findOne({ name: "EMPLOYEE" });
    if (employeeRole) defaultRoles = [employeeRole._id];
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      roles: defaultRoles,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: (await user.populate("roles")).toJSON(),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      "roles"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Auto-upgrade legacy admins and ensure default roles
    try {
      const raw = await User.collection.findOne(
        { _id: user._id },
        { projection: { role: 1 } }
      );
      const adminRole = await Role.findOneAndUpdate(
        { name: "ADMIN" },
        { name: "ADMIN" },
        { upsert: true, new: true }
      );
      const employeeRole = await Role.findOneAndUpdate(
        { name: "EMPLOYEE" },
        { name: "EMPLOYEE" },
        { upsert: true, new: true }
      );

      const currentRoleIds = (user.roles || []).map((r) => String(r._id || r));
      let changed = false;

      if (
        raw &&
        raw.role === "admin" &&
        !currentRoleIds.includes(String(adminRole._id))
      ) {
        user.roles = [
          ...(user.roles || []).map((r) => r._id || r),
          adminRole._id,
        ];
        changed = true;
      }

      if (
        (!user.roles || user.roles.length === 0) &&
        employeeRole &&
        !currentRoleIds.includes(String(employeeRole._id))
      ) {
        user.roles = [
          employeeRole._id,
          ...(user.roles || []).map((r) => r._id || r),
        ];
        changed = true;
      }

      if (changed) {
        await user.save();
        await user.populate("roles");
      }
    } catch (e) {
      console.error("Role upgrade on login failed:", e);
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
});

export default router;
