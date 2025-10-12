import express from 'express';
import {
  sendConnectionRequest,
  getConnections,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  getConnectionStatus,
} from '../controllers/connectionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/request', authenticate, sendConnectionRequest);
router.get('/', authenticate, getConnections);
router.put('/:id/accept', authenticate, acceptConnection);
router.put('/:id/reject', authenticate, rejectConnection);
router.delete('/:id/cancel', authenticate, cancelConnection);
router.get('/status/:targetUserId', authenticate, getConnectionStatus);

export default router;
