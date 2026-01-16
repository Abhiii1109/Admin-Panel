const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const ExtraCategory = require('../models/ExtraCategory');

/**
 * Dashboard Controller
 * Shows admin dashboard with statistics
 */
exports.showDashboard = async (req, res) => {
  try {
    // Get statistics
    const totalCategories = await Category.countDocuments();
    const totalSubcategories = await Subcategory.countDocuments();
    const totalExtraCategories = await ExtraCategory.countDocuments();

    // Get recent activities (last 5 categories)
    const recentCategories = await Category.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: {
        totalCategories,
        totalSubcategories,
        totalExtraCategories,
      },
      recentCategories,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/auth/login');
  }
};
