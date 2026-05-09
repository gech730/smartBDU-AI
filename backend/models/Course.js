import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
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
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  instructorName: String,
  prerequisites: [String],
  objectives: [String],
  syllabus: String,
  materials: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'doc']
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  gradingPolicy: {
    midterm: Number,
    final: Number,
    assignments: Number,
    participation: Number,
    project: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

courseSchema.index({ department: 1, yearOfStudy: 1, semester: 1 });

export default mongoose.model('Course', courseSchema);
