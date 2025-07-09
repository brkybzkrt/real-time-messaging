import Router from 'express';
import { getOnlineCount, getOnlineUsers, getSpesificUserWithOnlineStatus } from '../controllers/stats.controller.js';

const router = Router();

router.get('/online-count', getOnlineCount);
router.get('/online-users', getOnlineUsers);
router.get('/online-users/:userId', getSpesificUserWithOnlineStatus);

export { router as statsRoutes };
