import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cloudinary from './config/cloudinary.js';
import stripe from './config/stripe.js';
import { errorHandler } from './middleware/errorHandler.js';

// routes
import authRoutes from './routes/auth.js';
import toolRoutes from './routes/tools.js';
import bookingRoutes from './routes/bookings.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] }
});

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// attach io to app
app.set('io', io);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// socket namespace for each booking room
io.on('connection', socket => {
  socket.on('joinBooking', id => socket.join(id));
});

// Error handler middleware (must be last)
app.use(errorHandler);

// DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  httpServer.listen(process.env.PORT || 4000, () => 
    console.log(`Server running on port ${process.env.PORT || 4000}`)
  );
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});