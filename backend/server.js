import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://collegeresourcehubsefrontend.onrender.com' : 'http://localhost:3000', credentials: true, }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resource', resourceRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API running', timestamp: new Date().toISOString() });
});



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
  }

  if (err.message.includes('Only PDF, DOC')) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
});