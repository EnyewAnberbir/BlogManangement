const mongoose = require('mongoose');

async function connectDatabase(mongodbUri) {
  if (!mongodbUri) {
    console.warn('MONGODB_URI is not set. Database-backed routes may fail.');
    return false;
  }

  await mongoose.connect(mongodbUri);
  console.log('MongoDB connected');
  return true;
}

module.exports = { connectDatabase };
