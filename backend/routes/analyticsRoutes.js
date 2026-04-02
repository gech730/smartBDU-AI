import express from 'express';
import { trackEvent, getUserAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/track', protect, trackEvent);
router.get('/user', protect, getUserAnalytics);
router.get('/admin', protect, getAdminAnalytics);

export default router;
