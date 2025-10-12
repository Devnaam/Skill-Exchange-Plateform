import express from 'express';
import { getProfile, updateProfile, getUserById } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/:id', authenticate, getUserById);

export default router;
