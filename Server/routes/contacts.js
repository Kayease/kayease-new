import express from "express";
import Contact from "../models/Contact.js";
import { sendContactFormNotification } from "../utils/emailService.js";

const router = express.Router();

// Helper function to get client IP
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  );
};

// POST - Create new contact inquiry
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      subject,
      description,
      terms,
      recaptchaToken,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !subject ||
      !description ||
      !terms
    ) {
      return res.status(400).json({
      error: "All required fields must be provided",
      });
    }

    // Verify reCAPTCHA token (optional - you can add server-side verification here)
    if (!recaptchaToken) {
      return res.status(400).json({
        error: "reCAPTCHA verification required",
      });
    }

    // Check if email already submitted 5 times in the last 24 hours (prevent spam)
    const submissionsCount = await Contact.countDocuments({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    });

    if (submissionsCount >= 5) {
      return res.status(429).json({
      error:
        "You have reached the maximum number of submissions (5) in 24 hours. Please try again later.",
      });
    }

    // Create new contact
    const newContact = new Contact({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject,
      description: description.trim(),
      terms: true,
      ipAddress: getClientIP(req),
      userAgent: req.headers["user-agent"],
    });

    const savedContact = await newContact.save();

    // Send email notification to HR (don't wait for it to complete)
    sendContactFormNotification(savedContact).catch(err => 
      console.error('Failed to send contact form notification to HR:', err)
    );

    res.status(201).json({
      message:
        "Contact message received successfully! We'll get back to you soon.",
      contact: {
        id: savedContact._id,
        fullName: savedContact.fullName,
        email: savedContact.email,
        subject: savedContact.subjectLabel,
        createdAt: savedContact.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    res.status(500).json({
      error: "Failed to submit contact form. Please try again later.",
    });
  }
});

// GET - Get all contacts with filters and pagination (Admin only)
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      subject,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom,
      dateTo,
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) filter.status = status;
    if (subject) filter.subject = subject;

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const [contacts, totalContacts] = await Promise.all([
      Contact.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Contact.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalContacts / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      contacts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalContacts,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      error: "Failed to fetch contacts",
    });
  }
});

// GET - Get contact by ID (Admin only)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid contact ID",
      });
    }

    res.status(500).json({
      error: "Failed to fetch contact",
    });
  }
});

// PUT - Update contact (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isRead } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (isRead !== undefined) updateData.isRead = isRead;

    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedContact) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    res.json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid contact ID",
      });
    }

    res.status(500).json({
      error: "Failed to update contact",
    });
  }
});

// PATCH - Mark contact as read/unread (Admin only)
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead = true } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { isRead },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    res.json({
      message: `Contact marked as ${isRead ? "read" : "unread"}`,
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact read status:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid contact ID",
      });
    }

    res.status(500).json({
      error: "Failed to update contact read status",
    });
  }
});

// DELETE - Delete contact (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    res.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid contact ID",
      });
    }

    res.status(500).json({
      error: "Failed to delete contact",
    });
  }
});

// GET - Get contact statistics (Admin only)
router.get("/stats/overview", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [
      totalContacts,
      newContacts,
      contactedContacts,
      inProgressContacts,
      closedContacts,
      thisMonthContacts,
      thisWeekContacts,
      statusStats,
      subjectStats,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: "new" }),
      Contact.countDocuments({ status: "contacted" }),
      Contact.countDocuments({ status: "in-progress" }),
      Contact.countDocuments({ status: "closed" }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Contact.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Contact.aggregate([{ $group: { _id: "$subject", count: { $sum: 1 } } }]),
    ]);

    res.json({
      overview: {
        total: totalContacts,
        new: newContacts,
        contacted: contactedContacts,
        inProgress: inProgressContacts,
        closed: closedContacts,
      },
      thisMonth: thisMonthContacts,
      thisWeek: thisWeekContacts,
      statusBreakdown: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      subjectBreakdown: subjectStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({
      error: "Failed to fetch contact statistics",
    });
  }
});

// POST - Bulk update contact status (Admin only)
router.post("/bulk/update", async (req, res) => {
  try {
    const { ids, updateData } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "Contact IDs are required",
      });
    }

    const result = await Contact.updateMany({ _id: { $in: ids } }, updateData, {
      runValidators: true,
    });

    res.json({
      message: `${result.modifiedCount} contacts updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk updating contacts:", error);
    res.status(500).json({
      error: "Failed to update contacts",
    });
  }
});

// DELETE - Bulk delete contacts (Admin only)
router.post("/bulk/delete", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "Contact IDs are required",
      });
    }

    const result = await Contact.deleteMany({ _id: { $in: ids } });

    res.json({
      message: `${result.deletedCount} contacts deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting contacts:", error);
    res.status(500).json({
      error: "Failed to delete contacts",
    });
  }
});

export default router;
