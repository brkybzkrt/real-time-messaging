import Router from 'express';
import { getOnlineCount, getOnlineUsers, getSpesificUserWithOnlineStatus } from '../controllers/stats.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: User statistics and online status
 */

/**
 * @swagger
 * /api/stats/online-count:
 *   get:
 *     summary: Get count of online users
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successfully retrieved online user count
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: Number of users currently online
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/online-count', getOnlineCount);

/**
 * @swagger
 * /api/stats/online-users:
 *   get:
 *     summary: Get list of all online users
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successfully retrieved online users
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *                           online:
 *                             type: boolean
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/online-users', getOnlineUsers);

/**
 * @swagger
 * /api/stats/online-users/{userId}:
 *   get:
 *     summary: Get online status of a specific user
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user's online status
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         online:
 *                           type: boolean
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/online-users/:userId', getSpesificUserWithOnlineStatus);

export { router as statsRoutes };
