import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Role from './models/Role.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('Usage: node make-admin.js <email>');
      console.log('Example: node make-admin.js user@example.com');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    // Ensure ADMIN role exists and assign
    const adminRole = await Role.findOneAndUpdate(
      { name: 'ADMIN' },
      { name: 'ADMIN' },
      { upsert: true, new: true }
    );
    const currentRoles = (user.roles || []).map(r => String(r));
    if (!currentRoles.includes(String(adminRole._id))) {
      user.roles = [...(user.roles || []), adminRole._id];
    }
    await user.save();

    console.log(`✅ User ${email} is now an admin!`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Roles: ${(user.roles || []).map(r => r.toString()).join(', ')}`);

  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

makeAdmin(); 