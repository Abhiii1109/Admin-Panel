const ExtraCategory = require('../models/ExtraCategory');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const { validationResult } = require('express-validator');

/**
 * Extra Category Controller
 * Handles CRUD operations for extra categories
 */

// List all extra categories
exports.listExtraCategories = async (req, res) => {
  try {
    const extraCategories = await ExtraCategory.find()
      .populate('categoryId')
      .populate('subcategoryId')
      .sort({ createdAt: -1 });

    res.render('extra-category/list', {
      title: 'Extra Categories',
      extraCategories,
    });
  } catch (error) {
    console.error('List extra categories error:', error);
    req.flash('error', 'Failed to load extra categories');
    res.redirect('/dashboard');
  }
};

// Show create extra category form
exports.showCreateForm = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ name: 1 });
    res.render('extra-category/create', {
      title: 'Create Extra Category',
      categories,
    });
  } catch (error) {
    console.error('Show create form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/extra-category');
  }
};

// Create extra category
exports.createExtraCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/extra-category/create');
    }

    const { name, categoryId, subcategoryId } = req.body;

    await ExtraCategory.create({ name, categoryId, subcategoryId });

    req.flash('success', 'Extra category created successfully');
    res.redirect('/extra-category');
  } catch (error) {
    console.error('Create extra category error:', error);
    req.flash('error', 'Failed to create extra category');
    res.redirect('/extra-category/create');
  }
};

// Show edit extra category form
exports.showEditForm = async (req, res) => {
  try {
    const extraCategory = await ExtraCategory.findById(req.params.id);
    const categories = await Category.find({ status: 'Active' }).sort({ name: 1 });
    const subcategories = await Subcategory.find({ categoryId: extraCategory.categoryId });

    if (!extraCategory) {
      req.flash('error', 'Extra category not found');
      return res.redirect('/extra-category');
    }

    res.render('extra-category/edit', {
      title: 'Edit Extra Category',
      extraCategory,
      categories,
      subcategories,
    });
  } catch (error) {
    console.error('Show edit form error:', error);
    req.flash('error', 'Failed to load extra category');
    res.redirect('/extra-category');
  }
};

// Update extra category
exports.updateExtraCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/extra-category/edit/${req.params.id}`);
    }

    const { name, categoryId, subcategoryId } = req.body;

    await ExtraCategory.findByIdAndUpdate(req.params.id, {
      name,
      categoryId,
      subcategoryId,
    });

    req.flash('success', 'Extra category updated successfully');
    res.redirect('/extra-category');
  } catch (error) {
    console.error('Update extra category error:', error);
    req.flash('error', 'Failed to update extra category');
    res.redirect('/extra-category');
  }
};

// Delete extra category
exports.deleteExtraCategory = async (req, res) => {
  try {
    await ExtraCategory.findByIdAndDelete(req.params.id);
    req.flash('success', 'Extra category deleted successfully');
    res.redirect('/extra-category');
  } catch (error) {
    console.error('Delete extra category error:', error);
    req.flash('error', 'Failed to delete extra category');
    res.redirect('/extra-category');
  }
};
