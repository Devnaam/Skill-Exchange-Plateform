import express from 'express';
import {
  getAllSkills,
  createSkill,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  getSkillsByCategory,
} from '../controllers/skillController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes (or protected based on your needs)
router.get('/all', authenticate, getAllSkills);
router.get('/categories', authenticate, getSkillsByCategory);
router.post('/create', authenticate, createSkill);

// User skill routes
router.get('/user', authenticate, getUserSkills);
router.post('/user', authenticate, addUserSkill);
router.put('/user/:id', authenticate, updateUserSkill);
router.delete('/user/:id', authenticate, deleteUserSkill);

export default router;
