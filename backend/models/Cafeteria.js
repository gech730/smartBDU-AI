import mongoose from 'mongoose';

const cafeteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['main', 'faculty', 'hostel', 'cafe'],
    default: 'main'
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  contactPhone: String,
  capacity: Number,
  menus: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    breakfast: [{
      name: String,
      price: Number,
      calories: Number,
      available: { type: Boolean, default: true }
    }],
    lunch: [{
      name: String,
      price: Number,
      calories: Number,
      vegetarian: { type: Boolean, default: false },
      available: { type: Boolean, default: true }
    }],
    dinner: [{
      name: String,
      price: Number,
      calories: Number,
      vegetarian: { type: Boolean, default: false },
      available: { type: Boolean, default: true }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Cafeteria', cafeteriaSchema);
