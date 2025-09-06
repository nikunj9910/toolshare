import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {type:String, required:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  avatar: {type:String, default:'https://i.pravatar.cc/150?u=default'},
  isVerified: {type:Boolean, default:false},
  stripeAccountId: String,   // for paying owners
  location: {
    type: {type:String, enum:['Point'], default:'Point'},
    coordinates: {type:[Number], default:[0,0]}  // [lng, lat]
  }
}, {timestamps:true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };

export default mongoose.model('User', userSchema);