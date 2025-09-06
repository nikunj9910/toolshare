const bookingSchema = new mongoose.Schema({
  tool: {type:mongoose.Schema.Types.ObjectId, ref:'Tool', required:true},
  borrower: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  from: Date,
  to: Date,
  totalPrice: Number,
  status: {type:String, enum:['requested','accepted','paid','completed','cancelled'], default:'requested'},
  paymentIntentId: String
}, {timestamps:true});
export default mongoose.model('Booking', bookingSchema);