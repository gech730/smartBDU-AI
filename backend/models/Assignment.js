import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseCode: String,
  courseName: String,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    default: 100
  },
  type: {
    type: String,
    enum: ['homework', 'quiz', 'project', 'lab', 'presentation', 'exam'],
    default: 'homework'
  },
  instructions: String,
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now },
    score: Number,
    feedback: String,
    fileUrl: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

assignmentSchema.index({ course: 1, dueDate: 1 });

export default mongoose.model('Assignment', assignmentSchema);
