require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

/**
 * Seed Script - Create First Admin User
 * Run this script to create the initial admin account
 */

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: admin@example.com');
      process.exit(1);
    }
    
    // Create new admin
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123', // Will be hashed automatically by the model
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin@123');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
