const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { slugify } = require('../lib/slugify');

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 240, default: '' }
  },
  { timestamps: true }
);

CategorySchema.pre('validate', function assignCategorySlug(next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

module.exports = model('Category', CategorySchema);
