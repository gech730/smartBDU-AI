import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';

export const getCourses = async (req, res) => {
  try {
    const { department, yearOfStudy, semester, academicYear, search } = req.query;
    const query = { isActive: true };

    if (department) query.department = department;
    if (yearOfStudy) query.yearOfStudy = parseInt(yearOfStudy);
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort({ code: 1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email phone');
    
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { courseId, type, upcoming } = req.query;
    const query = { isActive: true };

    if (courseId) query.course = courseId;
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.dueDate = { $gte: new Date() };
    }

    const assignments = await Assignment.find(query)
      .populate('course', 'code name')
      .sort({ dueDate: 1 });

    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'code name')
      .populate('submissions.student', 'name universityId');
    
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Assignment not found' });
    }
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
