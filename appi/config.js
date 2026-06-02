const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getConfig() {
  const config = {
    port: Number(process.env.PORT || 4000),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET,
    mongodbUri: process.env.MONGODB_URI
  };

  if (!config.jwtSecret) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  return config;
}

module.exports = { getConfig };
