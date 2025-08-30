import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    email: { 
      type: String, 
      required: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    phone: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 20
    },
    subject: { 
      type: String, 
      required: true,
      enum: [
        'hire-us',
        'join-us',
        'partnership',
        'general-inquiry',
        'support',
        'feedback',
        'other'
      ]
    },
    description: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 2000
    },
    terms: { 
      type: Boolean, 
      required: true,
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'Terms and conditions must be accepted'
      }
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'closed', 'archived'],
      default: 'new'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: 'website'
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for subject label
ContactSchema.virtual('subjectLabel').get(function() {
  const subjectLabels = {
    'hire-us': 'Hire Us',
    'join-us': 'Join Us',
    'partnership': 'Partnership',
    'general-inquiry': 'General Inquiry',
    'support': 'Support',
    'feedback': 'Feedback',
    'other': 'Other'
  };
  return subjectLabels[this.subject] || this.subject;
});

// Index for better query performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ subject: 1 });

export default mongoose.model("Contact", ContactSchema);