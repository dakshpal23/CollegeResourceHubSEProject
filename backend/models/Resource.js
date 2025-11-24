import mongoose from 'mongoose';

/**
 * Resource Schema for storing uploaded files/notes
 * Includes approval workflow and file metadata
 */
const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: ['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'Other']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [50, 'Subject cannot exceed 50 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminRemark: {
    type: String,
    trim: true,
    maxlength: [200, 'Admin remark cannot exceed 200 characters']
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

/**
 * Index for better search performance
 */
resourceSchema.index({ title: 'text', description: 'text', subject: 'text' });
resourceSchema.index({ branch: 1, status: 1 });
resourceSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Resource', resourceSchema);