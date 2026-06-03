const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AuthorFollowSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

AuthorFollowSchema.index({ follower: 1, author: 1 }, { unique: true });

module.exports = model('AuthorFollow', AuthorFollowSchema);
