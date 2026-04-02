import express from 'express';
import { getCVTipsHandler, getInterviewPrepHandler } from '../controllers/careerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/cv-tips', protect, getCVTipsHandler);
router.post('/interview-prep', protect, getInterviewPrepHandler);

export default router;