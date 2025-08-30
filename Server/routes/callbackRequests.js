import express from "express";
import CallbackRequest from "../models/CallbackRequest.js";
import { sendCallbackRequestNotification } from "../utils/emailService.js";
import { getClientIP } from "../utils/emailService.js";

const router = express.Router();

// Submit callback request (public)
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, preferredTime, message } = req.body;

    // Validation
    if (!name || !phone || !preferredTime || !message) {
      return res.status(400).json({
        error: "Name, phone, preferred time, and message are required",
      });
    }

    // Check if phone already submitted 3 times in the last 24 hours (prevent spam)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingRequests = await CallbackRequest.countDocuments({
      phone: phone.trim(),
      createdAt: { $gte: oneDayAgo },
    });

    if (existingRequests >= 3) {
      return res.status(429).json({
        error:
          "Too many callback requests from this phone number. Please try again later.",
      });
    }

    // Create new callback request
    const newCallbackRequest = new CallbackRequest({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      preferredTime: new Date(preferredTime),
      message: message.trim(),
      ipAddress: getClientIP(req),
    });

    const savedRequest = await newCallbackRequest.save();

    // Send email notification to admin
    try {
      await sendCallbackRequestNotification(savedRequest);
    } catch (emailError) {
      console.error("Error sending callback request notification:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message:
        "Callback request submitted successfully! We'll call you at your preferred time.",
      request: {
        id: savedRequest._id,
        name: savedRequest.name,
        preferredTime: savedRequest.formattedTime,
        createdAt: savedRequest.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting callback request:", error);
    res.status(500).json({
      error: "Failed to submit callback request. Please try again.",
    });
  }
});

// Get all callback requests (Admin only)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      CallbackRequest.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CallbackRequest.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRequests: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching callback requests:", error);
    res.status(500).json({
      error: "Failed to fetch callback requests",
    });
  }
});

// Get callback request by ID (Admin only)
router.get("/:id", async (req, res) => {
  try {
    const request = await CallbackRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Callback request not found" });
    }
    res.json(request);
  } catch (error) {
    console.error("Error fetching callback request:", error);
    res.status(500).json({
      error: "Failed to fetch callback request",
    });
  }
});

// Update callback request (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isRead } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const updatedRequest = await CallbackRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Callback request not found" });
    }

    res.json({
      message: "Callback request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating callback request:", error);
    res.status(500).json({
      error: "Failed to update callback request",
    });
  }
});

// Bulk update callback requests (Admin only)
router.put("/bulk/update", async (req, res) => {
  try {
    const { ids, updateData } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "Request IDs are required",
      });
    }

    const result = await CallbackRequest.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} callback requests updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk updating callback requests:", error);
    res.status(500).json({
      error: "Failed to bulk update callback requests",
    });
  }
});

// Delete callback request (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await CallbackRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ error: "Callback request not found" });
    }

    res.json({
      message: "Callback request deleted successfully",
      request: deletedRequest,
    });
  } catch (error) {
    console.error("Error deleting callback request:", error);
    res.status(500).json({
      error: "Failed to delete callback request",
    });
  }
});

// Bulk delete callback requests (Admin only)
router.delete("/bulk/delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "Request IDs are required",
      });
    }

    const result = await CallbackRequest.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} callback requests deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting callback requests:", error);
    res.status(500).json({
      error: "Failed to bulk delete callback requests",
    });
  }
});

// Get callback request statistics (Admin only)
router.get("/stats/overview", async (req, res) => {
  try {
    const [
      total,
      newRequests,
      inProgressRequests,
      contactedRequests,
      statusStats,
    ] = await Promise.all([
      CallbackRequest.countDocuments(),
      CallbackRequest.countDocuments({ status: "new" }),
      CallbackRequest.countDocuments({ status: "in-progress" }),
      CallbackRequest.countDocuments({ status: "contacted" }),
      CallbackRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const statusBreakdown = statusStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      overview: {
        total,
        new: newRequests,
        inProgress: inProgressRequests,
        contacted: contactedRequests,
      },
      statusBreakdown,
    });
  } catch (error) {
    console.error("Error fetching callback request stats:", error);
    res.status(500).json({
      error: "Failed to fetch callback request statistics",
    });
  }
});

export default router;
