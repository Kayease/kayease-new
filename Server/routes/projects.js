import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// @route   GET /api/admin/projects
// @desc    Get all projects with populated data
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    let filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(filter)
      .populate('projectManager', 'name email')
      .populate('assignedEmployees.employee', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .populate('notes.author', 'name')
      .populate('files.uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// @route   GET /api/admin/projects/:id
// @desc    Get project by ID
// @access  Admin
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('projectManager', 'name email')
      .populate('assignedEmployees.employee', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .populate('notes.author', 'name')
      .populate('files.uploadedBy', 'name');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// @route   POST /api/admin/projects
// @desc    Create new project
// @access  Admin
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      budget,
      client,
      technologies,
      assignedEmployees,
      projectManager
    } = req.body;

    // Validate project manager exists and has appropriate role
    const manager = await User.findById(projectManager);
    if (!manager) {
      return res.status(400).json({
        success: false,
        message: 'Project manager not found'
      });
    }

    // Validate assigned employees exist
    if (assignedEmployees && assignedEmployees.length > 0) {
      for (const assignment of assignedEmployees) {
        const employee = await User.findById(assignment.employee);
        if (!employee) {
          return res.status(400).json({
            success: false,
            message: `Employee ${assignment.employee} not found`
          });
        }
      }
    }

    const project = new Project({
      title,
      description,
      status,
      priority,
      startDate,
      endDate,
      budget,
      client,
      technologies,
      assignedEmployees,
      projectManager
    });

    await project.save();
    
    const populatedProject = await project.populate([
      { path: 'projectManager', select: 'name email' },
      { path: 'assignedEmployees.employee', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// @route   PUT /api/admin/projects/:id
// @desc    Update project
// @access  Admin
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updateData = req.body;
    
    // Validate project manager if being updated
    if (updateData.projectManager) {
      const manager = await User.findById(updateData.projectManager);
      if (!manager) {
        return res.status(400).json({
          success: false,
          message: 'Project manager not found'
        });
      }
    }

    // Validate assigned employees if being updated
    if (updateData.assignedEmployees) {
      for (const assignment of updateData.assignedEmployees) {
        const employee = await User.findById(assignment.employee);
        if (!employee) {
          return res.status(400).json({
            success: false,
            message: `Employee ${assignment.employee} not found`
          });
        }
      }
    }

    Object.assign(project, updateData);
    await project.save();
    
    const updatedProject = await project.populate([
      { path: 'projectManager', select: 'name email' },
      { path: 'assignedEmployees.employee', select: 'name email' },
      { path: 'tasks.assignedTo', select: 'name email' },
      { path: 'notes.author', select: 'name' },
      { path: 'files.uploadedBy', select: 'name' }
    ]);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// @route   DELETE /api/admin/projects/:id
// @desc    Delete project
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// @route   GET /api/admin/projects/stats/overview
// @desc    Get project statistics overview
// @access  Admin
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      totalBudget,
      averageProgress
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['planning', 'in-progress'] } }),
      Project.countDocuments({ status: 'completed' }),
      Project.countDocuments({ 
        endDate: { $lt: new Date() }, 
        status: { $nin: ['completed', 'cancelled'] } 
      }),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: '$budget' } } }
      ]),
      Project.aggregate([
        { $group: { _id: null, avg: { $avg: '$progress' } } }
      ])
    ]);

    const stats = {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      overdue: overdueProjects,
      totalBudget: totalBudget[0]?.total || 0,
      averageProgress: Math.round(averageProgress[0]?.avg || 0)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics'
    });
  }
});

// @route   GET /api/admin/projects/stats/by-status
// @desc    Get project count by status
// @access  Admin
router.get('/stats/by-status', async (req, res) => {
  try {
    const statusStats = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: statusStats
    });
  } catch (error) {
    console.error('Error fetching status stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch status statistics'
    });
  }
});

// @route   GET /api/admin/projects/stats/by-priority
// @desc    Get project count by priority
// @access  Admin
router.get('/stats/by-priority', async (req, res) => {
  try {
    const priorityStats = await Project.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: priorityStats
    });
  } catch (error) {
    console.error('Error fetching priority stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch priority statistics'
    });
  }
});

export default router;
