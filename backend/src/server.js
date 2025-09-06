import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cloudinary from './config/cloudinary.js';
import stripe from './config/stripe.js';

// routes
import authRoutes from './routes/auth.js';
import toolRoutes from './routes/tools.js';
import bookingRoutes from './routes/bookings.js';
import msgRoutes from './routes/messages.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:{origin: process.env.FRONTEND_URL, methods:['GET','POST']}
});

app.use(cors({origin: process.env.FRONTEND_URL, credentials:true}));
app.use(express.json());

// attach io to app
app.set('io', io);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', msgRoutes);

// socket namespace for each booking room
io.on('connection', socket => {
  socket.on('joinBooking', id => socket.join(id));
});

// DB
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('Mongo connected');
  httpServer.listen(process.env.PORT||4000, ()=>console.log(`API on :${process.env.PORT}`));
});