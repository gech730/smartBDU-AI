import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['shuttle', 'bus', 'van'],
    default: 'shuttle'
  },
  route: {
    from: String,
    to: String,
    stops: [{
      name: String,
      location: String,
      time: String
    }]
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    departureTimes: [String],
    arrivalTimes: [String]
  }],
  capacity: Number,
  fare: {
    amount: Number,
    currency: { type: String, default: 'ETB' }
  },
  driverName: String,
  driverPhone: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Transport', transportSchema);
