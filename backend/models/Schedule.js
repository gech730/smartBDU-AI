import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  instructor: {
    type: String,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  building: String,
  color: {
    type: String,
    default: '#6366f1'
  },
  type: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial', 'seminar'],
    default: 'lecture'
  },
  credits: {
    type: Number,
    default: 3
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

scheduleSchema.index({ department: 1, yearOfStudy: 1, dayOfWeek: 1 });

export default mongoose.model('Schedule', scheduleSchema);
