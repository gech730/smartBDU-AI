import express from 'express';
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, markAsRead } from '../controllers/announcementController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAnnouncements);
router.get('/:id', protect, getAnnouncementById);
router.post('/', protect, adminOnly, createAnnouncement);
router.put('/:id', protect, adminOnly, updateAnnouncement);
router.delete('/:id', protect, adminOnly, deleteAnnouncement);
router.put('/:id/read', protect, markAsRead);

export default router;
