import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  renterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  pricing: {
    hourly: { type: Number, default: 0 },
    daily: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'declined', 'active', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentIntentId: String,
  deposit: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);