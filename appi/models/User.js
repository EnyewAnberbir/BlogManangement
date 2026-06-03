const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    role: {
      type: String,
      enum: ['reader', 'author', 'editor', 'admin'],
      default: 'author'
    }
  },
  { timestamps: true }
);

const UserModel = model('User', UserSchema);

module.exports = UserModel;
