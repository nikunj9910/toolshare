const msgSchema = new mongoose.Schema({
  booking: {type:mongoose.Schema.Types.ObjectId, ref:'Booking', required:true},
  sender: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  text: String,
  read: {type:Boolean, default:false}
}, {timestamps:true});
export default mongoose.model('Message', msgSchema);