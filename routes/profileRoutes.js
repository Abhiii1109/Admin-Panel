const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

/**
 * Profile Routes
 */

// View profile
router.get('/', isAuthenticated, profileController.showProfile);

// Edit profile
router.get('/edit', isAuthenticated, profileController.showEditProfile);
router.post(
  '/edit',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please enter a valid email'),
  ],
  profileController.updateProfile
);

// Change password
router.get('/change-password', isAuthenticated, authController.showChangePassword);
router.post(
  '/change-password',
  isAuthenticated,
  [
    body('oldPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
      ),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password'),
  ],
  authController.changePassword
);

module.exports = router;
