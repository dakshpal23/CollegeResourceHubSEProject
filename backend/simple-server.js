import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Test upload endpoint
app.post('/api/test-upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File received:', req.file ? req.file.originalname : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'college-resources'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});