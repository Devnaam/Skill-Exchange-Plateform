import express from 'express';
import { createReport, getReports } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create', authenticate, createReport);
router.get('/', authenticate, getReports);

export default router;
