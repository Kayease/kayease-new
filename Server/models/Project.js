import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative']
  },
  client: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: ['web-development', 'mobile-app', 'desktop-app', 'ai-ml', 'data-analytics', 'cybersecurity', 'cloud-infrastructure', 'e-commerce', 'cms', 'api-development', 'other'],
    default: 'web-development'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  assignedEmployees: [{
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['developer', 'designer', 'tester', 'analyst', 'manager', 'content-manager', 'creative-director', 'ui-ux-designer', 'frontend-developer', 'backend-developer', 'fullstack-developer', 'devops-engineer', 'data-scientist', 'machine-learning-engineer', 'cybersecurity-specialist', 'cloud-architect', 'product-manager', 'project-coordinator', 'quality-assurance', 'business-analyst', 'research-developer', 'technical-writer', 'support-specialist']
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project manager is required']
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100%'],
    default: 0
  },
  tasks: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'blocked'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    estimatedHours: {
      type: Number,
      min: 0
    },
    actualHours: {
      type: Number,
      min: 0
    }
  }],
  files: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    fileType: {
      type: String
    },
    fileSize: {
      type: Number
    }
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ status: 1, priority: 1 });
projectSchema.index({ projectManager: 1 });
projectSchema.index({ 'assignedEmployees.employee': 1 });
projectSchema.index({ startDate: 1, endDate: 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
