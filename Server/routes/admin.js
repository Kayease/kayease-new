import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Blog from '../models/Blog.js';
import Career from '../models/Career.js';
import Portfolio from '../models/Portfolio.js';
import Client from '../models/Client.js';
import Contact from '../models/Contact.js';
import Team from '../models/Team.js';
import JobApplication from '../models/JobApplication.js';
import CallbackRequest from '../models/CallbackRequest.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken, requireAdmin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('roles')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('roles');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Admin
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, roles: roleNamesOrIds, isActive } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    let roleIds = [];
    if (Array.isArray(roleNamesOrIds) && roleNamesOrIds.length > 0) {
      // Accept either role IDs or names
      const roles = await Role.find({
        $or: [
          { _id: { $in: roleNamesOrIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id)) } },
          { name: { $in: roleNamesOrIds.map(r => String(r).toUpperCase()) } }
        ]
      });
      roleIds = roles.map(r => r._id);
    } else {
      // default to EMPLOYEE role if exists
      const defaultRole = await Role.findOne({ name: 'EMPLOYEE' });
      if (defaultRole) roleIds = [defaultRole._id];
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roles: roleIds,
      isActive: isActive !== undefined ? isActive : true
    });

    await newUser.save();

    // Return user without password
    const userResponse = (await newUser.populate('roles')).toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Admin
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, password, roles: roleNamesOrIds, isActive } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (Array.isArray(roleNamesOrIds)) {
      const roles = await Role.find({
        $or: [
          { _id: { $in: roleNamesOrIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id)) } },
          { name: { $in: roleNamesOrIds.map(r => String(r).toUpperCase()) } }
        ]
      });
      user.roles = roles.map(r => r._id);
    }
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    // Hash password if provided
    if (password) {
      const saltRounds = 12;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    // Return user without password
    const userResponse = (await user.populate('roles')).toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the last admin
    const adminRole = await Role.findOne({ name: 'ADMIN' });
    if (adminRole && Array.isArray(user.roles) && user.roles.some(r => r.equals(adminRole._id))) {
      const adminCount = await User.countDocuments({ roles: adminRole._id });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @route   PUT /api/admin/users/:id/promote
// @desc    Promote user to admin
// @access  Admin
router.put('/users/:id/promote', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('roles');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const adminRole = await Role.findOne({ name: 'ADMIN' });
    if (!adminRole) {
      return res.status(400).json({ success: false, message: 'ADMIN role is not configured' });
    }
    const alreadyAdmin = Array.isArray(user.roles) && user.roles.some(r => String(r._id) === String(adminRole._id));
    if (alreadyAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    user.roles = [...(user.roles || []).map(r => r._id), adminRole._id];
    await user.save();

    const userResponse = (await user.populate('roles')).toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User promoted to admin successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to promote user'
    });
  }
});

// @route   PUT /api/admin/users/:id/demote
// @desc    Demote admin to user
// @access  Admin
router.put('/users/:id/demote', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('roles');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const adminRole = await Role.findOne({ name: 'ADMIN' });
    if (!adminRole) {
      return res.status(400).json({ success: false, message: 'ADMIN role is not configured' });
    }
    const isAdmin = Array.isArray(user.roles) && user.roles.some(r => String(r._id) === String(adminRole._id));
    if (!isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User is not an admin'
      });
    }

    // Prevent demoting the last admin
    const adminCount = await User.countDocuments({ roles: adminRole._id });
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote the last admin user'
      });
    }

    user.roles = (user.roles || []).filter(r => String(r._id) !== String(adminRole._id));
    await user.save();

    const userResponse = (await user.populate('roles')).toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Admin demoted to user successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error demoting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to demote user'
    });
  }
});

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user status (activate/deactivate)
// @access  Admin
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const userResponse = (await user.populate('roles')).toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: userResponse
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    });
  }
});

// @route   GET /api/admin/users/stats
// @desc    Get user statistics
// @access  Admin
router.get('/users/stats', async (req, res) => {
  try {
    const adminRole = await Role.findOne({ name: 'ADMIN' });
    const [totalUsers, adminUsers, activeUsers, inactiveUsers, newUsers] = await Promise.all([
      User.countDocuments(),
      adminRole ? User.countDocuments({ roles: adminRole._id }) : 0,
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      success: true,
      data: {
        total: totalUsers,
        admins: adminUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        newUsers: newUsers
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// @route   GET /api/admin/users/new
// @desc    Get new users (registered in last 7 days)
// @access  Admin
router.get('/users/new', async (req, res) => {
  try {
    const newUsers = await User.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
    .select('-password')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: newUsers
    });
  } catch (error) {
    console.error('Error fetching new users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new users'
    });
  }
});

// ===== Roles Management =====
// @route   GET /api/admin/roles
// @desc    Get all roles
// @access  Admin
router.get('/roles', async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
});

// @route   POST /api/admin/roles
// @desc    Create a new role
// @access  Admin
router.post('/roles', async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = new Role({ name: String(name).toUpperCase(), description });
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ success: false, message: 'Failed to create role' });
  }
});

// @route   PUT /api/admin/users/:id/roles
// @desc    Replace roles for a user
// @access  Admin
router.put('/users/:id/roles', async (req, res) => {
  try {
    const userId = req.params.id;
    const { roles: roleNamesOrIds } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const roles = await Role.find({
      $or: [
        { _id: { $in: (roleNamesOrIds || []).filter(id => /^[0-9a-fA-F]{24}$/.test(id)) } },
        { name: { $in: (roleNamesOrIds || []).map(r => String(r).toUpperCase()) } }
      ]
    });

    user.roles = roles.map(r => r._id);
    await user.save();
    const userResponse = (await user.populate('roles')).toObject();
    delete userResponse.password;
    res.json({ success: true, message: 'User roles updated', data: userResponse });
  } catch (error) {
    console.error('Error updating user roles:', error);
    res.status(500).json({ success: false, message: 'Failed to update user roles' });
  }
});


// @route   GET /api/admin/dashboard
// @desc    Get general dashboard data
// @access  Admin
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic counts for dashboard overview
    const [
      blogCount,
      careerCount,
      portfolioCount,
      clientCount,
      contactCount,
      teamCount,
      applicationCount,
      userCount
    ] = await Promise.all([
      Blog.countDocuments(),
      Career.countDocuments(),
      Portfolio.countDocuments(),
      Client.countDocuments(),
      Contact.countDocuments(),
      Team.countDocuments(),
      JobApplication.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          blogs: blogCount,
          careers: careerCount,
          portfolio: portfolioCount,
          clients: clientCount,
          contacts: contactCount,
          team: teamCount,
          applications: applicationCount,
          users: userCount
        },
        message: 'Dashboard data retrieved successfully'
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Admin
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get counts from all collections
    const [
      blogStats,
      careerStats,
      portfolioStats,
      clientStats,
      contactStats,
      teamStats,
      applicationStats,
      callbackStats
    ] = await Promise.all([
      Blog.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
            drafts: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
            featured: { $sum: { $cond: ['$featured', 1, 0] } }
          }
        }
      ]),
      Career.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            paused: { $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] } },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
          }
        }
      ]),
      Portfolio.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
            featured: { $sum: { $cond: ['$featured', 1, 0] } }
          }
        }
      ]),
      Client.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } }
          }
        }
      ]),
      Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
          }
        }
      ]),
      Team.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } }
          }
        }
      ]),
      JobApplication.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            reviewing: { $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } },
            selected: { $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
          }
        }
      ]),
      CallbackRequest.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
            contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } }
          }
        }
      ])
    ]);

    // Extract data from aggregation results
    const stats = {
      blogs: blogStats[0] || { total: 0, published: 0, drafts: 0, featured: 0 },
      careers: careerStats[0] || { total: 0, active: 0, paused: 0, closed: 0 },
      portfolio: portfolioStats[0] || { total: 0, completed: 0, inProgress: 0, featured: 0 },
      clients: clientStats[0] || { total: 0, active: 0 },
      contacts: contactStats[0] || { total: 0, new: 0, contacted: 0, inProgress: 0, closed: 0 },
      team: teamStats[0] || { total: 0, active: 0, inactive: 0 },
      applications: applicationStats[0] || { total: 0, pending: 0, reviewing: 0, selected: 0, rejected: 0 },
      callbacks: callbackStats[0] || { total: 0, new: 0, inProgress: 0, contacted: 0 }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @route   GET /api/admin/dashboard/quick-stats
// @desc    Get quick statistics for dashboard
// @access  Admin
router.get('/dashboard/quick-stats', async (req, res) => {
  try {
    const [applications, contacts, portfolio, blogs, callbacks] = await Promise.all([
      JobApplication.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Portfolio.countDocuments({ status: 'in-progress' }),
      Blog.countDocuments({ status: 'published' }),
      CallbackRequest.countDocuments({ status: 'new' })
    ]);

    const quickStats = [
      {
        title: "Total Applications",
        value: applications,
        change: "+12%",
        changeType: "positive",
        icon: "UserPlus",
        color: "bg-gradient-to-br from-blue-500 to-blue-600",
        description: "Job applications received"
      },
      {
        title: "New Contacts",
        value: contacts,
        change: "+5%",
        changeType: "positive",
        icon: "Mail",
        color: "bg-gradient-to-br from-yellow-500 to-orange-500",
        description: "New inquiries received"
      },
      {
        title: "Active Projects",
        value: portfolio,
        change: "+3%",
        changeType: "positive",
        icon: "TrendingUp",
        color: "bg-gradient-to-br from-purple-500 to-indigo-600",
        description: "Currently in progress"
      },
      {
        title: "Published Blogs",
        value: blogs,
        change: "+8%",
        changeType: "positive",
        icon: "FileText",
        color: "bg-gradient-to-br from-green-500 to-emerald-600",
        description: "Published articles"
      },
      {
        title: "Pending Callbacks",
        value: callbacks,
        change: "+15%",
        changeType: "positive",
        icon: "Phone",
        color: "bg-gradient-to-br from-emerald-500 to-teal-600",
        description: "Callback requests waiting"
      }
    ];

    res.json({
      success: true,
      data: quickStats
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quick statistics'
    });
  }
});

// @route   GET /api/admin/dashboard/activities
// @desc    Get recent activities for dashboard
// @access  Admin
router.get('/dashboard/activities', async (req, res) => {
  try {
    // Get recent activities from different collections
    const [recentApplications, recentContacts, recentBlogs, recentPortfolio] = await Promise.all([
      JobApplication.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select('name position status createdAt'),
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select('name email subject status createdAt'),
      Blog.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select('title status createdAt'),
      Portfolio.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select('title status createdAt')
    ]);

    const activities = [];

    // Process applications
    recentApplications.forEach(app => {
      activities.push({
        id: `app_${app._id}`,
        type: "application_received",
        title: "New job application",
        description: `${app.name} applied for ${app.position}`,
        time: getTimeAgo(app.createdAt),
        icon: "Briefcase",
        color: "bg-orange-500",
        bgColor: "bg-orange-50"
      });
    });

    // Process contacts
    recentContacts.forEach(contact => {
      activities.push({
        id: `contact_${contact._id}`,
        type: "contact_inquiry",
        title: "New contact inquiry",
        description: `${contact.name} - ${contact.subject}`,
        time: getTimeAgo(contact.createdAt),
        icon: "Mail",
        color: "bg-blue-500",
        bgColor: "bg-blue-50"
      });
    });

    // Process blogs
    recentBlogs.forEach(blog => {
      if (blog.status === 'published') {
        activities.push({
          id: `blog_${blog._id}`,
          type: "blog_published",
          title: "Blog post published",
          description: blog.title,
          time: getTimeAgo(blog.createdAt),
          icon: "FileText",
          color: "bg-purple-500",
          bgColor: "bg-purple-50"
        });
      }
    });

    // Process portfolio
    recentPortfolio.forEach(project => {
      if (project.status === 'completed') {
        activities.push({
          id: `portfolio_${project._id}`,
          type: "project_completed",
          title: "Project completed",
          description: project.title,
          time: getTimeAgo(project.createdAt),
          icon: "CheckCircle",
          color: "bg-green-500",
          bgColor: "bg-green-50"
        });
      }
    });

    // Sort by creation time and limit to 6 activities
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    activities.splice(6);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities'
    });
  }
});

// @route   GET /api/admin/notifications
// @desc    Get admin notifications
// @access  Admin
router.get('/notifications', async (req, res) => {
  try {
    // Get recent notifications based on recent activities
    const [newApplications, newContacts, pendingReviews] = await Promise.all([
      JobApplication.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'new' }),
      JobApplication.countDocuments({ status: 'reviewing' })
    ]);

    const notifications = [];

    if (newApplications > 0) {
      notifications.push({
        id: 'new_applications',
        title: 'New job applications',
        message: `${newApplications} new application${newApplications > 1 ? 's' : ''} received`,
        type: 'info',
        read: false,
        time: 'Just now'
      });
    }

    if (newContacts > 0) {
      notifications.push({
        id: 'new_contacts',
        title: 'New contact inquiries',
        message: `${newContacts} new inquiry${newContacts > 1 ? 'ies' : ''} received`,
        type: 'success',
        read: false,
        time: 'Just now'
      });
    }

    if (pendingReviews > 0) {
      notifications.push({
        id: 'pending_reviews',
        title: 'Applications pending review',
        message: `${pendingReviews} application${pendingReviews > 1 ? 's' : ''} need review`,
        type: 'warning',
        read: false,
        time: 'Just now'
      });
    }

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default router;