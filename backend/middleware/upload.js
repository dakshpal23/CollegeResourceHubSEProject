import multer from 'multer';
import path from 'path';

/**
 * Configure multer for file uploads
 * Files are stored in memory before uploading to Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * File filter to allow only specific file types
 */
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedTypes = /pdf|doc|docx|ppt|pptx|jpg|jpeg|png/;
  
  // Check file extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG files are allowed'));
  }
};

/**
 * Multer upload configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

export default upload;