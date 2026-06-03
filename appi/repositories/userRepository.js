const User = require('../models/User');

async function findByUsername(username) {
  return User.findOne({ username });
}

async function createUser(payload) {
  return User.create(payload);
}

async function findById(id) {
  return User.findById(id);
}

module.exports = { findByUsername, createUser, findById };
