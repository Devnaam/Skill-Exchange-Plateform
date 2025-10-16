import express from 'express';
import {
  getAllSkills,
  createSkill,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  getCategories,           // ✅ Import this
  getSkillsByCategory,
} from '../controllers/skillController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// ==================== PUBLIC/AUTH ROUTES ====================

// Get all skills (with optional filters)
router.get('/', authenticate, getAllSkills);

// Get all categories (THIS WAS YOUR PROBLEM!)
router.get('/categories', authenticate, getCategories); // ✅ FIXED - Use getCategories

// Get skills by specific category
router.get('/category/:categoryId', authenticate, getSkillsByCategory);

// Create a new skill
router.post('/', authenticate, createSkill);

// ==================== USER SKILL ROUTES ====================

// Get current user's skills
router.get('/user', authenticate, getUserSkills);

// Add skill to user profile
router.post('/user', authenticate, addUserSkill);

// Update user skill
router.put('/user/:id', authenticate, updateUserSkill);

// Delete user skill
router.delete('/user/:id', authenticate, deleteUserSkill);

export default router;
