import express from 'express';
import { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSchedules);
router.get('/:id', protect, getScheduleById);
router.post('/', protect, adminOnly, createSchedule);
router.put('/:id', protect, adminOnly, updateSchedule);
router.delete('/:id', protect, adminOnly, deleteSchedule);

export default router;
