const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

/**
 * Category Routes
 */

// List categories
router.get('/', isAuthenticated, categoryController.listCategories);

// Create category
router.get('/create', isAuthenticated, categoryController.showCreateForm);
router.post(
  '/create',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('status').isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  ],
  categoryController.createCategory
);

// Edit category
router.get('/edit/:id', isAuthenticated, categoryController.showEditForm);
router.post(
  '/edit/:id',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Category name is required').trim(),
    body('status').isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  ],
  categoryController.updateCategory
);

// Delete category
router.post('/delete/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = router;
