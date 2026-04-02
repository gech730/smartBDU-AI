import express from 'express';
import { generateCVHandler, getCVTemplates } from '../controllers/cvController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateCVHandler);
router.get('/templates', getCVTemplates);

export default router;
