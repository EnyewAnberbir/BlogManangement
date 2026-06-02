const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
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
  }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
