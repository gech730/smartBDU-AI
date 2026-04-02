import Department from '../models/Department.js';
import BDUInfo from '../models/BDUInfo.js';

const careerMappings = {
  programming: ['Computer Science', 'Information Systems', 'Software Engineering'],
  'web development': ['Computer Science', 'Information Systems'],
  'data science': ['Computer Science', 'Information Systems', 'Statistics'],
  'ai': ['Computer Science', 'Information Systems'],
  'machine learning': ['Computer Science', 'Information Systems'],
  'medicine': ['Medicine', 'Nursing', 'Public Health'],
  'healthcare': ['Nursing', 'Medicine', 'Public Health'],
  'business': ['Business Administration', 'Economics', 'Accounting'],
  'management': ['Business Administration', 'Public Administration'],
  'engineering': ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
  'electronics': ['Electrical Engineering'],
  'construction': ['Civil Engineering', 'Architecture'],
  'architecture': ['Architecture', 'Civil Engineering'],
  'law': ['Law'],
  'economics': ['Economics', 'Business Administration'],
  'agriculture': ['Agriculture', 'Agricultural Economics'],
  'nursing': ['Nursing'],
  'mechanical': ['Mechanical Engineering'],
  'electrical': ['Electrical Engineering'],
  'civil': ['Civil Engineering'],
  'marketing': ['Business Administration', 'Marketing'],
  'finance': ['Business Administration', 'Economics', 'Accounting'],
  'teaching': ['Education', 'Physics', 'Chemistry', 'Mathematics']
};

export const getCareerRecommendations = async (req, res) => {
  try {
    const { interests, skills, careerGoal } = req.body;
    
    const userInput = [interests, skills, careerGoal].flat().join(' ').toLowerCase();
    
    const matchedDepartments = new Set();
    
    for (const [keyword, depts] of Object.entries(careerMappings)) {
      if (userInput.includes(keyword)) {
        depts.forEach(d => matchedDepartments.add(d));
      }
    }
    
    const departments = await Department.find({});
    const allDepartmentNames = departments.map(d => d.name.toLowerCase());
    
    allDepartmentNames.forEach(deptName => {
      if (userInput.includes(deptName.replace(' ', '')) || userInput.includes(deptName.split(' ').pop()?.toLowerCase() || '')) {
        departments.forEach(d => {
          if (d.name.toLowerCase().includes(deptName.split(' ').pop()?.toLowerCase() || '')) {
            matchedDepartments.add(d.name);
          }
        });
      }
    });
    
    let recommended = [];
    
    if (matchedDepartments.size > 0) {
      recommended = departments.filter(d => matchedDepartments.has(d.name));
    } else {
      recommended = departments.sort((a, b) => b.popularity - a.popularity).slice(0, 5);
    }
    
    const careerPaths = recommended.map(dept => ({
      department: dept.name,
      code: dept.code,
      faculty: dept.faculty,
      skills: dept.skills,
      careers: dept.careerOpportunities,
      matchScore: matchedDepartments.has(dept.name) ? 95 : Math.floor(Math.random() * 20 + 60),
      salaryRange: dept.salaryRange,
      description: dept.description
    }));
    
    res.json({ recommendations: careerPaths });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentCareerPaths = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const department = await Department.findById(departmentId);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    const careerPaths = department.careerOpportunities.map(career => ({
      title: career,
      requiredSkills: department.skills.slice(0, 4),
      avgSalary: department.salaryRange,
      growth: 'High demand'
    }));
    
    res.json({ careerPaths });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCareers = async (req, res) => {
  try {
    const departments = await Department.find({});
    
    const careerMap = {};
    
    departments.forEach(dept => {
      dept.careerOpportunities.forEach(career => {
        if (!careerMap[career]) {
          careerMap[career] = {
            title: career,
            departments: [dept.name],
            skills: dept.skills.slice(0, 3),
            salaryRange: dept.salaryRange
          };
        } else {
          careerMap[career].departments.push(dept.name);
          careerMap[career].skills = [...new Set([...careerMap[career].skills, ...dept.skills.slice(0, 3)])];
        }
      });
    });
    
    res.json({ careers: Object.values(careerMap) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
