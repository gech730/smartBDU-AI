import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true,
    match: [/^BDU\d{7}$/, 'University ID must be in format BDUxxxxxxx (7 digits)']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  department: {
    type: String,
    required: function() { return this.role === 'student' || this.role === 'faculty'; }
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 6
  },
  program: {
    type: String,
    enum: ['undergraduate', 'masters', 'phd'],
    default: 'undergraduate'
  },
  phone: String,
  avatar: String,
  bio: String,
  interests: [String],
  favoriteSubjects: [String],
  goals: [String],
  preferredDepartment: String,
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  notifications: [{
    type: {
      type: String,
      enum: ['announcement', 'schedule', 'assignment', 'system']
    },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    universityId: this.universityId,
    name: this.name,
    email: this.email,
    role: this.role,
    department: this.department,
    yearOfStudy: this.yearOfStudy,
    program: this.program,
    phone: this.phone,
    avatar: this.avatar,
    bio: this.bio,
    interests: this.interests,
    favoriteSubjects: this.favoriteSubjects,
    goals: this.goals,
    skills: this.skills,
    createdAt: this.createdAt
  };
};

export default mongoose.model('User', userSchema);
