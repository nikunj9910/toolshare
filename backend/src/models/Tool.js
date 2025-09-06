import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  name: {type:String, required:true},
  description: String,
  images: [String],
  pricePerDay: {type:Number, required:true},
  category: {type:String, enum:['Power tools','Garden','Cleaning','Other'], default:'Other'},
  condition: {type:String, enum:['Excellent','Good','Fair'], default:'Good'},
  unavailableDates: [{from:Date, to:Date}],
  rating: {type:Number, default:0},
  numReviews: {type:Number, default:0}
}, {timestamps:true});

toolSchema.index({location:'2dsphere'});
export default mongoose.model('Tool', toolSchema);