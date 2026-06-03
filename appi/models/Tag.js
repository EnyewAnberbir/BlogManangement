const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { slugify } = require('../lib/slugify');

const TagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 40, unique: true },
    slug: { type: String, required: true, unique: true, index: true }
  },
  { timestamps: true }
);

TagSchema.pre('validate', function assignTagSlug(next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

module.exports = model('Tag', TagSchema);
