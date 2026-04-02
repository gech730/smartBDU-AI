import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  steps: [{
    title: String,
    description: String,
    duration: String,
    resources: [String],
    skills: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);