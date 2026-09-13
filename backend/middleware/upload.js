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
  // Get file extension
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Allowed file extensions
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
  
  // Check if file extension is allowed
  if (allowedExtensions.includes(fileExtension)) {
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

// Simple upload wrapper
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('Upload middleware error:', err);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

export { uploadSingle };

export default upload;