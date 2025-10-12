import express from 'express';
import {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
} from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/send', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/conversation/:otherUserId', authenticate, getConversation);
router.get('/unread-count', authenticate, getUnreadCount);

export default router;
