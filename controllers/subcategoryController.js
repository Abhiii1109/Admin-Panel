const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

/**
 * Subcategory Controller
 * Handles CRUD operations for subcategories
 */

// List all subcategories
exports.listSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate('categoryId')
      .sort({ createdAt: -1 });

    res.render('subcategory/list', {
      title: 'Subcategories',
      subcategories,
    });
  } catch (error) {
    console.error('List subcategories error:', error);
    req.flash('error', 'Failed to load subcategories');
    res.redirect('/dashboard');
  }
};

// Show create subcategory form
exports.showCreateForm = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' }).sort({ name: 1 });
    res.render('subcategory/create', {
      title: 'Create Subcategory',
      categories,
    });
  } catch (error) {
    console.error('Show create form error:', error);
    req.flash('error', 'Failed to load form');
    res.redirect('/subcategory');
  }
};

// Create subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/subcategory/create');
    }

    const { name, categoryId } = req.body;

    await Subcategory.create({ name, categoryId });

    req.flash('success', 'Subcategory created successfully');
    res.redirect('/subcategory');
  } catch (error) {
    console.error('Create subcategory error:', error);
    req.flash('error', 'Failed to create subcategory');
    res.redirect('/subcategory/create');
  }
};

// Show edit subcategory form
exports.showEditForm = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    const categories = await Category.find({ status: 'Active' }).sort({ name: 1 });

    if (!subcategory) {
      req.flash('error', 'Subcategory not found');
      return res.redirect('/subcategory');
    }

    res.render('subcategory/edit', {
      title: 'Edit Subcategory',
      subcategory,
      categories,
    });
  } catch (error) {
    console.error('Show edit form error:', error);
    req.flash('error', 'Failed to load subcategory');
    res.redirect('/subcategory');
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect(`/subcategory/edit/${req.params.id}`);
    }

    const { name, categoryId } = req.body;

    await Subcategory.findByIdAndUpdate(req.params.id, { name, categoryId });

    req.flash('success', 'Subcategory updated successfully');
    res.redirect('/subcategory');
  } catch (error) {
    console.error('Update subcategory error:', error);
    req.flash('error', 'Failed to update subcategory');
    res.redirect('/subcategory');
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    req.flash('success', 'Subcategory deleted successfully');
    res.redirect('/subcategory');
  } catch (error) {
    console.error('Delete subcategory error:', error);
    req.flash('error', 'Failed to delete subcategory');
    res.redirect('/subcategory');
  }
};

// API: Get subcategories by category (for dynamic dropdown)
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ categoryId: req.params.categoryId });
    res.json(subcategories);
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};
