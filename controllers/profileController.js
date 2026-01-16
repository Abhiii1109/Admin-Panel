const Admin = require('../models/Admin');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

/**
 * Profile Controller
 * Handles admin profile management
 */

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
}).single('profileImage');

// Show profile page
exports.showProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      req.flash('error', 'Admin not found');
      return res.redirect('/auth/login');
    }

    res.render('profile/index', {
      title: 'My Profile',
      admin,
    });
  } catch (error) {
    console.error('Show profile error:', error);
    req.flash('error', 'Failed to load profile');
    res.redirect('/dashboard');
  }
};

// Show edit profile form
exports.showEditProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      req.flash('error', 'Admin not found');
      return res.redirect('/auth/login');
    }

    res.render('profile/edit', {
      title: 'Edit Profile',
      admin,
    });
  } catch (error) {
    console.error('Show edit profile error:', error);
    req.flash('error', 'Failed to load profile');
    res.redirect('/profile');
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/profile/edit');
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/profile/edit');
      }

      const { name, email } = req.body;

      // Check if email is already taken by another admin
      const existingAdmin = await Admin.findOne({
        email,
        _id: { $ne: req.session.adminId },
      });

      if (existingAdmin) {
        req.flash('error', 'Email already in use');
        return res.redirect('/profile/edit');
      }

      const updateData = { name, email };

      // If new image uploaded
      if (req.file) {
        updateData.profileImage = '/uploads/' + req.file.filename;
      }

      const admin = await Admin.findByIdAndUpdate(
        req.session.adminId,
        updateData,
        { new: true }
      );

      // Update session data
      req.session.adminName = admin.name;
      req.session.adminEmail = admin.email;
      req.session.adminImage = admin.profileImage;

      req.flash('success', 'Profile updated successfully');
      res.redirect('/profile');
    } catch (error) {
      console.error('Update profile error:', error);
      req.flash('error', 'Failed to update profile');
      res.redirect('/profile/edit');
    }
  });
};
