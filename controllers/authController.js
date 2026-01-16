const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');
const { sendOTPEmail } = require('../config/mail');

/**
 * Authentication Controller
 * Handles login, logout, forgot password, OTP verification, and password reset
 */

// Show login page
exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Admin Login' });
};

// Show register page
exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Create Account' });
};

// Handle register
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/register');
    }

    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/register');
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password // Model pre-save hook handles hashing
    });

    // Create session (auto-login)
    req.session.adminId = admin._id;
    req.session.adminName = admin.name;
    req.session.adminEmail = admin.email;
    req.session.adminImage = admin.profileImage;

    req.flash('success', 'Account created successfully! Welcome.');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Register error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/register');
  }
};

// Handle login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/login');
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth/login');
    }

    // Create session
    req.session.adminId = admin._id;
    req.session.adminName = admin.name;
    req.session.adminEmail = admin.email;
    req.session.adminImage = admin.profileImage;

    req.flash('success', 'Login successful!');
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};

// Show forgot password page
exports.showForgotPassword = (req, res) => {
  res.render('auth/forgot-password', { title: 'Forgot Password' });
};

// Handle forgot password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/forgot-password');
    }

    const { email } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash('error', 'No account found with this email');
      return res.redirect('/auth/forgot-password');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry (5 minutes from now)
    const otpExpiry = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000);

    // Save OTP to database
    admin.resetOTP = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Store email in session for OTP verification
    req.session.resetEmail = email;

    req.flash('success', 'OTP has been sent to your email');
    res.redirect('/auth/verify-otp');
  } catch (error) {
    console.error('Forgot password error:', error);
    req.flash('error', 'Failed to send OTP. Please try again.');
    res.redirect('/auth/forgot-password');
  }
};

// Show OTP verification page
exports.showVerifyOTP = (req, res) => {
  if (!req.session.resetEmail) {
    req.flash('error', 'Please request password reset first');
    return res.redirect('/auth/forgot-password');
  }
  res.render('auth/verify-otp', { title: 'Verify OTP', email: req.session.resetEmail });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/verify-otp');
    }

    const { otp } = req.body;
    const email = req.session.resetEmail;

    if (!email) {
      req.flash('error', 'Session expired. Please try again.');
      return res.redirect('/auth/forgot-password');
    }

    // Find admin with OTP
    const admin = await Admin.findOne({ email, resetOTP: otp });

    if (!admin) {
      req.flash('error', 'Invalid OTP');
      return res.redirect('/auth/verify-otp');
    }

    // Check if OTP expired
    if (admin.otpExpiry < new Date()) {
      req.flash('error', 'OTP has expired. Please request a new one.');
      return res.redirect('/auth/forgot-password');
    }

    // OTP is valid, allow password reset
    req.session.otpVerified = true;
    req.flash('success', 'OTP verified successfully');
    res.redirect('/auth/reset-password');
  } catch (error) {
    console.error('OTP verification error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/verify-otp');
  }
};

// Show reset password page
exports.showResetPassword = (req, res) => {
  if (!req.session.otpVerified) {
    req.flash('error', 'Please verify OTP first');
    return res.redirect('/auth/forgot-password');
  }
  res.render('auth/reset-password', { title: 'Reset Password' });
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/auth/reset-password');
    }

    const { password, confirmPassword } = req.body;
    const email = req.session.resetEmail;

    if (!req.session.otpVerified || !email) {
      req.flash('error', 'Session expired. Please try again.');
      return res.redirect('/auth/forgot-password');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/reset-password');
    }

    // Find admin and update password
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash('error', 'Admin not found');
      return res.redirect('/auth/forgot-password');
    }

    admin.password = password;
    admin.resetOTP = null;
    admin.otpExpiry = null;
    await admin.save();

    // Clear session data
    delete req.session.resetEmail;
    delete req.session.otpVerified;

    req.flash('success', 'Password reset successful. Please login.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Reset password error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/reset-password');
  }
};

// Change password (for logged-in admin)
exports.showChangePassword = (req, res) => {
  res.render('profile/change-password', { title: 'Change Password' });
};

exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/profile/change-password');
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/profile/change-password');
    }

    // Find admin
    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      req.flash('error', 'Admin not found');
      return res.redirect('/auth/login');
    }

    // Verify old password
    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/profile/change-password');
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    req.flash('success', 'Password changed successfully');
    res.redirect('/profile');
  } catch (error) {
    console.error('Change password error:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/profile/change-password');
  }
};
