import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tool from './models/Tool.js';
import bcrypt from 'bcryptjs';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany();
await Tool.deleteMany();

const users = await User.insertMany([
  {name:'Sarah K.', email:'sarah@demo.com', password: await bcrypt.hash('123456',12), isVerified:true, location:{type:'Point',coordinates:[-122.4194,37.7749]}},
  {name:'Mike R.', email:'mike@demo.com', password: await bcrypt.hash('123456',12), isVerified:true, location:{type:'Point',coordinates:[-122.4194,37.7849]}}
]);

const tools = await Tool.insertMany([
  {owner: users[0]._id, name:'Power Drill 18V', description:'Cordless, 2 batteries, charger & case.', pricePerDay:8, category:'Power tools', condition:'Excellent', images:['https://source.unsplash.com/600x400/?drill']},
  {owner: users[1]._id, name:'Ladder 12 ft', description:'Aluminium, lightweight.', pricePerDay:12, category:'Other', condition:'Good', images:['https://source.unsplash.com/600x400/?ladder']}
]);

console.log('DB seeded');
process.exit();