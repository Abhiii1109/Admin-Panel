const express = require('express');
const router = express.Router();
const extraCategoryController = require('../controllers/extraCategoryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

/**
 * Extra Category Routes
 */

// List extra categories
router.get('/', isAuthenticated, extraCategoryController.listExtraCategories);

// Create extra category
router.get('/create', isAuthenticated, extraCategoryController.showCreateForm);
router.post(
  '/create',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Extra category name is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('subcategoryId').notEmpty().withMessage('Subcategory is required'),
  ],
  extraCategoryController.createExtraCategory
);

// Edit extra category
router.get('/edit/:id', isAuthenticated, extraCategoryController.showEditForm);
router.post(
  '/edit/:id',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Extra category name is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('subcategoryId').notEmpty().withMessage('Subcategory is required'),
  ],
  extraCategoryController.updateExtraCategory
);

// Delete extra category
router.post('/delete/:id', isAuthenticated, extraCategoryController.deleteExtraCategory);

module.exports = router;
