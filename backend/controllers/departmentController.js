import Department from '../models/Department.js';
import { getDepartmentInfo, recommendDepartments } from '../ai/service.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (department) {
      res.json(department);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await getDepartmentInfo(name);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { interests, favoriteSubjects } = req.body;
    const recommendations = await recommendDepartments(interests, favoriteSubjects);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchDepartments = async (req, res) => {
  try {
    const { q } = req.query;
    const departments = await Department.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { faculty: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};