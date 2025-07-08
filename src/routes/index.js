import express from 'express';
import { authRoutes } from './auth.routes.js';
import { userRoutes } from './user.routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/user', userRoutes);

export { router as apiRoutes };
