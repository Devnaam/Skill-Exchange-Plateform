import express from 'express';
import {
  getMatches,
  searchUsers,
  getMatchDetails,
} from '../controllers/matchController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getMatches);
router.get('/search', authenticate, searchUsers);
router.get('/:matchId', authenticate, getMatchDetails);

export default router;
