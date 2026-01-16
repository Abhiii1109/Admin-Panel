const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { body } = require('express-validator');

/**
 * Subcategory Routes
 */

// List subcategories
router.get('/', isAuthenticated, subcategoryController.listSubcategories);

// Create subcategory
router.get('/create', isAuthenticated, subcategoryController.showCreateForm);
router.post(
  '/create',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Subcategory name is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required'),
  ],
  subcategoryController.createSubcategory
);

// Edit subcategory
router.get('/edit/:id', isAuthenticated, subcategoryController.showEditForm);
router.post(
  '/edit/:id',
  isAuthenticated,
  [
    body('name').notEmpty().withMessage('Subcategory name is required').trim(),
    body('categoryId').notEmpty().withMessage('Category is required'),
  ],
  subcategoryController.updateSubcategory
);

// Delete subcategory
router.post('/delete/:id', isAuthenticated, subcategoryController.deleteSubcategory);

// API: Get subcategories by category
router.get('/api/by-category/:categoryId', subcategoryController.getSubcategoriesByCategory);

module.exports = router;
