import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';

dotenv.config({
  path: new URL('../.env', import.meta.url),
});

const PORT = process.env.PORT || 5000;
console.log(`Starting Inventory API on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode...`);
logger.info('Starting Inventory API', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info('API server is running', {
        port: PORT,
        healthCheck: `http://localhost:${PORT}/api/health`,
      });
    });
  })
  .catch((error) => {
    logger.error('Failed to start API server', {
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    });
    process.exit(1);
  });
