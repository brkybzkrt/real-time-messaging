import express from 'express';
import { 
  createConversation,
  getUserConversations,
} from '../controllers/conversation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createConversation);
router.get('/', authenticate, getUserConversations);

export default router;
