import express from 'express';
import { getCareerRecommendations, getDepartmentCareerPaths, getAllCareers } from '../controllers/careerRecommendationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/recommend', protect, getCareerRecommendations);
router.get('/department/:departmentId', protect, getDepartmentCareerPaths);
router.get('/all', protect, getAllCareers);

export default router;
