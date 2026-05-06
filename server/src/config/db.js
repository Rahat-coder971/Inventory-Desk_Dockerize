import mongoose from 'mongoose';
import { logger, maskMongoUri } from '../utils/logger.js';

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Add it to server/.env.');
  }

  mongoose.set('strictQuery', true);

  logger.info('Connecting to MongoDB', {
    uri: maskMongoUri(mongoUri),
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', {
      message: error.message,
    });
  });

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info('MongoDB connected', {
    database: mongoose.connection.name,
    host: mongoose.connection.host,
  });
}
