import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  
  // Job Information
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: [true, 'Job ID is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  
  // Professional Information
  currentPosition: {
    type: String,
    trim: true,
    maxlength: [100, 'Current position cannot exceed 100 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years']
  },
  expectedSalary: {
    type: String,
    trim: true,
    maxlength: [50, 'Expected salary cannot exceed 50 characters']
  },
  
  // Location & Availability
  currentLocation: {
    type: String,
    required: [true, 'Current location is required'],
    trim: true,
    maxlength: [100, 'Current location cannot exceed 100 characters']
  },
  willingToRelocate: {
    type: Boolean,
    default: false
  },
  
  // Skills & Portfolio
  skills: [{
    type: String,
    trim: true
  }],
  portfolioUrl: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  
  // Cover Letter & Resume
 
  resumeUrl: {
    type: String,
    trim: true
  },
  resumeFileName: {
    type: String,
    trim: true
  },
  resumeCloudinaryId: {
    type: String,
    trim: true
  },
  resumeFolder: {
    type: String,
    trim: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Admin Notes & Communication
  adminNotes: [{
    note: {
      type: String,
      required: true,
      trim: true
    },
    addedBy: {
      type: String,
      required: true,
      trim: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Communications
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'meeting'],
      required: true
    },
    subject: String,
    message: String,
    sentBy: {
      type: String,
      required: true
    },
    sentTo: String,
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Interview Information
  interviewDetails: {
    scheduledDate: Date,
    interviewType: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'hr']
    },
    interviewerName: String,
    interviewerEmail: String,
    meetingLink: String,
    notes: String
  },
  
  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'message'],
      required: true
    },
    subject: String,
    message: {
      type: String,
      required: true
    },
    sentBy: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Metadata
  source: {
    type: String,
    enum: ['website', 'linkedin', 'referral', 'job_board', 'other'],
    default: 'website'
  },
  referredBy: {
    type: String,
    trim: true
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Additional Information
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional information cannot exceed 1000 characters']
  },
  
  // Privacy & Consent
  consentToProcess: {
    type: Boolean,
    required: [true, 'Consent to process data is required'],
    default: false
  },
  marketingConsent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ jobId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ appliedAt: -1 });
jobApplicationSchema.index({ jobTitle: 1, status: 1 });

// Compound indexes for duplicate checking
jobApplicationSchema.index({ email: 1, jobId: 1 }); // For checking duplicate email per job
jobApplicationSchema.index({ phone: 1, jobId: 1 }); // For checking duplicate phone per job
jobApplicationSchema.index({ email: 1, appliedAt: -1 }); // For checking recent applications by email
jobApplicationSchema.index({ phone: 1, appliedAt: -1 }); // For checking recent applications by phone

// Virtual for full name
jobApplicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for application age
jobApplicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const applied = new Date(this.appliedAt);
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Pre-save middleware to update lastUpdated
jobApplicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get applications by status
jobApplicationSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('jobId').sort({ appliedAt: -1 });
};

// Static method to get applications for a specific job
jobApplicationSchema.statics.getByJob = function(jobId) {
  return this.find({ jobId }).sort({ appliedAt: -1 });
};

// Instance method to add admin note
jobApplicationSchema.methods.addAdminNote = function(note, addedBy) {
  this.adminNotes.push({
    note,
    addedBy,
    addedAt: new Date()
  });
  return this.save();
};

// Instance method to update status
jobApplicationSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  if (note) {
    this.adminNotes.push({
      note: `Status changed to ${newStatus}: ${note}`,
      addedBy: updatedBy,
      addedAt: new Date()
    });
  }
  return this.save();
};

// Instance method to add communication
jobApplicationSchema.methods.addCommunication = function(type, subject, message, sentBy) {
  this.communications.push({
    type,
    subject,
    message,
    sentBy,
    sentAt: new Date()
  });
  return this.save();
};

export default mongoose.model('JobApplication', jobApplicationSchema);