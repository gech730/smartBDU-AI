import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  faculty: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '4 years'
  },
  requirements: [{
    type: String
  }],
  skills: [{
    type: String
  }],
  courses: [{
    code: String,
    name: String,
    description: String
  }],
  careerOpportunities: [{
    type: String
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'ETB'
    }
  },
  popularity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);