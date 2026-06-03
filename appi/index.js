const { getConfig } = require('./config');
const { connectDatabase } = require('./db/connection');
const { createApp } = require('./app');

async function startServer() {
  const config = getConfig();

  try {
    await connectDatabase(config.mongodbUri);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }

  const app = createApp(config);
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { createApp, startServer };
