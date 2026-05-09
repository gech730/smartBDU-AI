import express from 'express';
import { getDormitories, getDormitoryById, getCafeterias, getCafeteriaById, getTodayMenu, getTransport, getTransportById } from '../controllers\campusController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dormitories', protect, getDormitories);
router.get('/dormitories/:id', protect, getDormitoryById);
router.get('/cafeterias', protect, getCafeterias);
router.get('/cafeterias/:id', protect, getCafeteriaById);
router.get('/cafeterias/menu/today', protect, getTodayMenu);
router.get('/transport', protect, getTransport);
router.get('/transport/:id', protect, getTransportById);

export default router;
