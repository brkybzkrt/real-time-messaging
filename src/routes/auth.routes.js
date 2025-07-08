import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected routes (require authentication)
router.get('/me', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

export { router as authRoutes };
