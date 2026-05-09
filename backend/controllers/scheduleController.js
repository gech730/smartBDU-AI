import Schedule from '../models/Schedule.js';

export const getSchedules = async (req, res) => {
  try {
    const { department, yearOfStudy, dayOfWeek, semester, academicYear } = req.query;
    const query = { isActive: true };

    if (department) query.department = department;
    if (yearOfStudy) query.yearOfStudy = parseInt(yearOfStudy);
    if (dayOfWeek) query.dayOfWeek = dayOfWeek;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const schedules = await Schedule.find(query).sort({ dayOfWeek: 1, startTime: 1 });
    res.json({ success: true, schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
