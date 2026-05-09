import express from 'express';
import { getCourses, getCourseById, createCourse, getAssignments, getAssignmentById, createAssignment } from '../controllers/courseController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/courses/:id', protect, getCourseById);
router.post('/', protect, adminOnly, createCourse);
router.get('/assignments', protect, getAssignments);
router.get('/assignments/:id', protect, getAssignmentById);
router.post('/assignments', protect, adminOnly, createAssignment);

export default router;
