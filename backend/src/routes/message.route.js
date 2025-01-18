import express from 'express';

import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js'; // Corrected path

import { protectRoute } from '../middleware/auth.middleware.js'; // Named import

const router = express.Router();

router.get('/user', protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;
