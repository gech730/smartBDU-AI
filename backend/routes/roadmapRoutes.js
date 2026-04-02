import express from 'express';
import { createRoadmap, getRoadmaps, getRoadmapById, deleteRoadmap, createInterestRoadmap } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, createRoadmap);
router.post('/', protect, createInterestRoadmap);
router.get('/', protect, getRoadmaps);
router.get('/:id', protect, getRoadmapById);
router.delete('/:id', protect, deleteRoadmap);

export default router;