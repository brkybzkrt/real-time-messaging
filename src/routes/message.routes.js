import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getMessages } from '../controllers/message.controller.js';

const router = Router();
router.get('/:id/messages', authenticate, getMessages);

export { router as messageRoutes };
