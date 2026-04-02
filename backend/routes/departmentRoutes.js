import express from 'express';
import { 
  getAllDepartments, 
  getDepartmentById, 
  getDepartmentByName,
  getRecommendations,
  searchDepartments 
} from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/search', searchDepartments);
router.post('/recommend', getRecommendations);
router.get('/name/:name', getDepartmentByName);
router.get('/:id', getDepartmentById);

export default router;