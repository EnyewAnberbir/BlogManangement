const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { slugify } = require('../lib/slugify');

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20
    },
    cover: {
      type: String,
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true
  }
);

PostSchema.pre('validate', function assignSlug(next) {
  if (this.title) {
    const baseSlug = slugify(this.title);
    this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
  }
  next();
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
