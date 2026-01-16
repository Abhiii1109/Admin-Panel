const mongoose = require('mongoose');

/**
 * Extra Category Schema
 * Belongs to both Category and Subcategory
 */
const extraCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Extra category name is required'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: [true, 'Subcategory is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ExtraCategory', extraCategorySchema);
