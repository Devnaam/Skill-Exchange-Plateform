import express from 'express';
import {
  createVouch,
  getUserVouches,
  getMyVouches,
  deleteVouch,
} from '../controllers/vouchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create', authenticate, createVouch);
router.get('/user/:userId', authenticate, getUserVouches);
router.get('/my-vouches', authenticate, getMyVouches);
router.delete('/:id', authenticate, deleteVouch);

export default router;
