const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

/**
 * Authentication Routes
 */

// Login routes
router.get('/login', isGuest, authController.showLogin);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Register routes
router.get('/register', isGuest, authController.showRegister);
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
      ),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password'),
  ],
  authController.register
);

// Logout
router.get('/logout', authController.logout);

// Forgot password routes
router.get('/forgot-password', isGuest, authController.showForgotPassword);
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please enter a valid email')],
  authController.forgotPassword
);

// OTP verification routes
router.get('/verify-otp', authController.showVerifyOTP);
router.post(
  '/verify-otp',
  [body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')],
  authController.verifyOTP
);

// Reset password routes
router.get('/reset-password', authController.showResetPassword);
router.post(
  '/reset-password',
  [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage(
        'Password must contain at least 1 uppercase letter, 1 number, and 1 special character'
      ),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password'),
  ],
  authController.resetPassword
);

module.exports = router;
