import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import JobApplication from '../models/JobApplication.js';
import Career from '../models/Career.js';
import { sendNewApplicationNotification, sendApplicationConfirmation, sendStatusUpdateNotification, sendCustomEmail, testEmailConnection, sendJobApplicationToHR } from '../utils/emailService.js';
import { deleteResumeFromCloudinary, deleteUserFolderFromCloudinary } from '../utils/resumeUpload.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation helper
const validateRequired = (fields, body) => {
  const errors = [];
  fields.forEach(field => {
    if (!body[field] || body[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  return errors;
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// @route   POST /api/job-applications
// @desc    Submit a new job application
// @access  Public
router.post('/', async (req, res) => {
  try {
    
    // Check if body is empty or undefined
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty or invalid',
        receivedBody: req.body,
        contentType: req.headers['content-type']
      });
    }
    
    // Validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'jobId', 'jobTitle',
      'experience', 'currentLocation', 
    ];
    
    // Ensure req.body exists before validation
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is undefined',
        contentType: req.headers['content-type']
      });
    }
    
    const validationErrors = validateRequired(requiredFields, req.body);
    
    if (!validateEmail(req.body.email)) {
      validationErrors.push('Please provide a valid email address');
    }
    
    if (!validatePhone(req.body.phone)) {
      validationErrors.push('Please provide a valid phone number');
    }
    
    if (!req.body.consentToProcess || req.body.consentToProcess !== 'true') {
      validationErrors.push('Consent to process data is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if job exists
    const job = await Career.findById(req.body.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check for duplicate application
    const existingApplication = await JobApplication.findOne({
      email: req.body.email,
      jobId: req.body.jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    // Create new application
    const application = new JobApplication({
      ...req.body,
      status: 'pending',
      appliedAt: new Date()
    });

    await application.save();

    // Populate job details for email
    await application.populate('jobId', 'title department location');

    // Send confirmation email to applicant
    try {
      await sendApplicationConfirmation(application);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Send notification to HR
    try {
      await sendNewApplicationNotification(application);
    } catch (emailError) {
      console.error('Error sending HR notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/job-applications/check-duplicate
// @desc    Check if user has already applied for a job
// @access  Public
router.get('/check-duplicate', async (req, res) => {
  try {
    const { email, jobId } = req.query;

    if (!email || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'Email and jobId are required'
      });
    }

    const existingApplication = await JobApplication.findOne({
      email: email,
      jobId: jobId
    });

    res.json({
      success: true,
      data: {
        hasApplied: !!existingApplication,
        application: existingApplication
      }
    });

  } catch (error) {
    console.error('Error checking duplicate application:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking duplicate application'
    });
  }
});

// @route   GET /api/job-applications
// @desc    Get all job applications (Admin only)
// @access  Private/Admin
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      jobId,
      search,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (jobId) {
      query.jobId = jobId;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const applications = await JobApplication.find(query)
      .populate('jobId', 'title department location')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const total = await JobApplication.countDocuments(query);

    // Get status counts
    const statusCounts = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        },
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/job-applications/stats/overview  
// @desc    Get application statistics
// @access  Private/Admin
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          reviewing: { $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
          interviewed: { $sum: { $cond: [{ $eq: ['$status', 'interviewed'] }, 1, 0] } },
          selected: { $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        total: 0,
        pending: 0,
        reviewing: 0,
        shortlisted: 0,
        interviewed: 0,
        selected: 0,
        rejected: 0
      }
    });

  } catch (error) {
    console.error('Error fetching application statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// @route   GET /api/job-applications/:id
// @desc    Get single job application
// @access  Private/Admin
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id)
      .populate('jobId', 'title department location');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application'
    });
  }
});

// @route   PUT /api/job-applications/:id/status
// @desc    Update application status
// @access  Private/Admin
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, note, updatedBy } = req.body;

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const oldStatus = application.status;
    await application.updateStatus(status, note, updatedBy);

    // Send status update notification (don't wait for it to complete)
    if (oldStatus !== status) {
      sendStatusUpdateNotification(application, status, note).catch(err => 
        console.error('Failed to send status update email:', err)
      );
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        applicationId: application._id,
        status: application.status,
        lastUpdated: application.lastUpdated
      }
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/job-applications/:id/notes
// @desc    Add admin note to application
// @access  Private/Admin
router.post('/:id/notes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { note, addedBy } = req.body;

    if (!note || !addedBy) {
      return res.status(400).json({
        success: false,
        message: 'Note and addedBy are required'
      });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.addAdminNote(note, addedBy);

    res.json({
      success: true,
      message: 'Note added successfully',
      data: {
        applicationId: application._id,
        notesCount: application.adminNotes.length
      }
    });

  } catch (error) {
    console.error('Error adding admin note:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/job-applications/:id/communications
// @desc    Add communication record and send email
// @access  Private/Admin
router.post('/:id/communications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, subject, message, sentBy, sentTo } = req.body;

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Send the email
    try {
      await sendCustomEmail(sentTo, subject, message, sentBy);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailError.message
      });
    }

    // Record the communication
    const communication = {
      type,
      subject,
      message,
      sentBy,
      sentTo,
      sentAt: new Date()
    };

    application.communications.push(communication);
    await application.save();

    res.json({
      success: true,
      message: 'Email sent and communication recorded successfully',
      data: {
        applicationId: application._id,
        communicationId: communication._id,
        communicationsCount: application.communications.length
      }
    });

  } catch (error) {
    console.error('Error sending email and recording communication:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/job-applications/send-email
// @desc    Send custom email to applicant
// @access  Private/Admin
router.post('/send-email', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { to, subject, message, fromName = 'Kayease HR Team' } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'To, subject, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Send the email
    const result = await sendCustomEmail(to, subject, message, fromName);

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: result.messageId,
        to: to,
        subject: subject
      }
    });

  } catch (error) {
    console.error('Error sending custom email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/job-applications/:id
// @desc    Delete a job application
// @access  Private/Admin
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Delete the entire user folder from Cloudinary if it exists
    if (application.resumeFolder) {
      try {
        const deleteResult = await deleteUserFolderFromCloudinary(application.resumeFolder);
        
      } catch (deleteError) {
        console.error('Error deleting user folder from Cloudinary:', {
          folder: application.resumeFolder,
          error: deleteError.message,
          stack: deleteError.stack
        });
        // Continue with deletion even if Cloudinary deletion fails
        // This ensures the application is still deleted from the database
      }
    } else if (application.resumeCloudinaryId) {
      // Fallback: Delete individual resume if folder is not available
      try {
        const deleteResult = await deleteResumeFromCloudinary(application.resumeCloudinaryId);
      } catch (deleteError) {
        console.error('Error deleting resume from Cloudinary:', {
          publicId: application.resumeCloudinaryId,
          error: deleteError.message,
          stack: deleteError.stack
        });
        // Continue with deletion even if Cloudinary deletion fails
        // This ensures the application is still deleted from the database
      }
    } else {
      console.error('No resume or folder found in Cloudinary for application:', application._id);
    }

    // Delete the application from database
    await JobApplication.findByIdAndDelete(req.params.id);

    // Update job application count
    if (application.jobId) {
      await Career.findByIdAndUpdate(application.jobId, {
        $inc: { applicationCount: -1 }
      });
    }

    res.json({
      success: true,
      message: 'Application and associated resume folder deleted successfully',
      data: {
        applicationId: req.params.id
      }
    });

  } catch (error) {
    console.error('Error deleting job application:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/job-applications/test-email
// @desc    Test email connection
// @access  Private/Admin
router.get('/test-email', async (req, res) => {
  try {
    const result = await testEmailConnection();
    res.json(result);
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

// @route   POST /api/job-applications/test-send-email
// @desc    Test sending a sample email
// @access  Private/Admin
router.post('/test-send-email', async (req, res) => {
  try {
    const { to = process.env.ADMIN_EMAIL } = req.body;
    
    const testApplication = {
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
      email: to,
      jobTitle: 'Test Position',
      experience: '2 years',
      appliedAt: new Date()
    };

    // Test sending confirmation email
    const result = await sendApplicationConfirmation(testApplication);
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        messageId: result.messageId,
        to: to
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

export default router;