import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  category: { 
    type: String, 
    enum: ['Power Tools', 'Garden', 'Cleaning', 'Automotive', 'Construction', 'Other'], 
    default: 'Other' 
  },
  price: {
    hourly: { type: Number, default: 0 },
    daily: { type: Number, required: true }
  },
  deposit: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }  // [lng, lat]
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    unavailableDates: [{ from: Date, to: Date }]
  },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

toolSchema.index({ location: '2dsphere' });
export default mongoose.model('Tool', toolSchema);