import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'EE', 'CE', 'IT', 'Other']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
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
    maxlength: 200
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

resourceSchema.index({ title: 'text', description: 'text', subject: 'text' });
resourceSchema.index({ branch: 1, status: 1 });
resourceSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Resource', resourceSchema);