import mongoose from 'mongoose';

const dormitorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['male', 'female', 'mixed'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    default: 0
  },
  floors: Number,
  roomsPerFloor: Number,
  amenities: [{
    name: String,
    available: { type: Boolean, default: true }
  }],
  facilities: {
    wifi: { type: Boolean, default: true },
    laundry: { type: Boolean, default: true },
    cafeteria: { type: Boolean, default: true },
    studyRoom: { type: Boolean, default: true },
    recreation: { type: Boolean, default: true }
  },
  roomTypes: [{
    type: String,
    enum: ['single', 'double', 'triple', 'dormitory'],
    price: Number,
    available: Number
  }],
  rules: [String],
  contactPhone: String,
  wardenName: String,
  wardenContact: String,
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Dormitory', dormitorySchema);
