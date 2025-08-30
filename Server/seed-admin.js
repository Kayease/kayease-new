import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/Role.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Ensure base roles exist
    const baseRoles = ['ADMIN', 'EMPLOYEE', 'MANAGER', 'HR', 'WEBSITE MANAGER'];
    for (const roleName of baseRoles) {
      await Role.updateOne({ name: roleName }, { name: roleName }, { upsert: true });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'team@kayease.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminRole = await Role.findOne({ name: 'ADMIN' });
    const employeeRole = await Role.findOne({ name: 'EMPLOYEE' });
    const adminUser = new User({
      name: 'Admin User',
      email: 'team@kayease.com',
      password: 'team@kayease.com',
      roles: [adminRole?._id, employeeRole?._id].filter(Boolean),
      isActive: true
    });

    await adminUser.save();

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();