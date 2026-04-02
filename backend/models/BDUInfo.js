import mongoose from 'mongoose';

const bduInfoSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['campus', 'facility', 'admission', 'overview', 'service', 'history']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  keywords: [String],
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

bduInfoSchema.index({ title: 'text', description: 'text', keywords: 'text' });

export default mongoose.model('BDUInfo', bduInfoSchema);
