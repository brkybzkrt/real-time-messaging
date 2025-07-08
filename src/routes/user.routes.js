import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticate, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();
const userController = new UserController();






router.get('/list',authenticate, adminOnly, userController.listUsers);
router.patch('/update/:id', authenticate, userController.updateUser);

export { router as userRoutes };