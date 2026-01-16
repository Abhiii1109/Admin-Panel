const Category = require('../models/Category');
const { validationResult } = require('express-validator');

/**
 * Category Controller
 * Handles CRUD operations for categories
 */

// List all categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.render('category/list', {
      title: 'Categories',
      categories,
    });
  } catch (error) {
    console.error('List categories error:', error);
    req.flash('error', 'Failed to load categories');
    res.redirect('/dashboard');
  }
};

// Show create category form
exports.showCreateForm = (req, res) => {
  res.render('category/create', { title: 'Create Category' });
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/category/create');
    }

    const { name, status } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      req.flash('error', 'Category already exists');
      return res.redirect('/category/create');
    }

    await Category.create({ name, status });

    req.flash('success', 'Category created successfully');
    res.redirect('/category');
  } catch (error) {
    console.error('Create category error:', error);
    req.flash('error', 'Failed to create category');
    res.redirect('/category/create');
  }
};

// Show edit category form
exports.showEditForm = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/category');
    }

    res.render('category/edit', {
      title: 'Edit Category',
      category,
    });
  } catch (error) {
    console.error('Show edit form error:', error);
    req.flash('error', 'Failed to load category');
    res.redirect('/category');
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/category/edit/${req.params.id}`);
    }

    const { name, status } = req.body;

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      req.flash('error', 'Category name already exists');
      return res.redirect(`/category/edit/${req.params.id}`);
    }

    await Category.findByIdAndUpdate(req.params.id, { name, status });

    req.flash('success', 'Category updated successfully');
    res.redirect('/category');
  } catch (error) {
    console.error('Update category error:', error);
    req.flash('error', 'Failed to update category');
    res.redirect('/category');
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category deleted successfully');
    res.redirect('/category');
  } catch (error) {
    console.error('Delete category error:', error);
    req.flash('error', 'Failed to delete category');
    res.redirect('/category');
  }
};
