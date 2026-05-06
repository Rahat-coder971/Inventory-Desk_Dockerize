import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    message: 'Inventory API is running',
    healthCheck: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  const databaseStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const databaseStatus = databaseStates[mongoose.connection.readyState] || 'unknown';

  res.json({
    status: 'ok',
    service: 'inventory-api',
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    database: databaseStatus,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
