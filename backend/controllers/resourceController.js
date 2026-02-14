import Resource from '../models/Resource.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary-fixed.js';
import path from 'path';

// Upload resource (students need approval, admins auto-approved)
const uploadResource = async (req, res) => {
  try {
    const { title, description, branch, subject } = req.body;
    const file = req.file;

    if (!file || !title || !description || !branch || !subject) {
      return res.status(400).json({ message: 'All fields and file are required' });
    }

    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'college-resources',
          public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
          flags: 'attachment'
        },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(file.buffer);
    });

    const status = req.user.role === 'admin' ? 'approved' : 'pending';
    const message = req.user.role === 'admin' 
      ? 'Resource uploaded and approved successfully.' 
      : 'Resource uploaded successfully. Waiting for admin approval.';

    const resource = await Resource.create({
      title,
      description,
      branch,
      subject,
      fileUrl: result.secure_url,
      fileType: fileExtension,
      uploadedBy: req.user._id,
      status
    });

    await resource.populate('uploadedBy', 'name email');

    res.status(201).json({ success: true, message, resource });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading resource',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get approved resources with search/filter
const getApprovedResources = async (req, res) => {
  try {
    const { search, branch, subject, sort = 'newest' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'approved' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    if (branch && branch !== 'all') query.branch = branch;
    if (subject) query.subject = { $regex: subject, $options: 'i' };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { downloadCount: -1 },
      title: { title: 1 }
    };

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

// Get pending resources (admin only)
const getPendingResources = async (req, res) => {
  try {
    console.log('Admin requesting pending resources...');
    
    const resources = await Resource.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log(`Found ${resources.length} pending resources`);
    resources.forEach(r => console.log(`- ${r.title} by ${r.uploadedBy?.name}`));

    res.json({
      success: true,
      resources,
      total: resources.length
    });
  } catch (error) {
    console.error('Error fetching pending resources:', error);
    res.status(500).json({ message: 'Error fetching pending resources', error: error.message });
  }
};

// Approve resource (admin only)
const approveResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', adminRemark: req.body.remark || '' },
      { new: true }
    ).populate('uploadedBy', 'name email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ success: true, message: 'Resource approved successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error approving resource' });
  }
};

// Reject resource (admin only)
const rejectResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminRemark: req.body.remark || 'No reason provided' },
      { new: true }
    ).populate('uploadedBy', 'name email');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ success: true, message: 'Resource rejected successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting resource' });
  }
};

// Delete resource (admin only)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Delete from Cloudinary
    const publicId = resource.fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`college-resources/${publicId}`);

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource' });
  }
};

// Get single resource and increment download count
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.status === 'approved') {
      resource.downloadCount += 1;
      await resource.save();
    }

    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource' });
  }
};

// Get user's uploaded resources
const getMyUploads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const resources = await Resource.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments({ uploadedBy: req.user._id });

    res.json({
      success: true,
      resources,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your uploads' });
  }
};

// Get dashboard stats (admin only)
const getStats = async (req, res) => {
  try {
    const [totalResources, pendingResources, totalUsers, resourcesByBranch, popularResources] = await Promise.all([
      Resource.countDocuments({ status: 'approved' }),
      Resource.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'student' }),
      Resource.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$branch', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Resource.find({ status: 'approved' })
        .populate('uploadedBy', 'name')
        .sort({ downloadCount: -1 })
        .limit(5)
    ]);

    res.json({
      success: true,
      stats: { totalResources, pendingResources, totalUsers, resourcesByBranch, popularResources }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Debug endpoint to check all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({})
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });
    
    console.log('All resources in database:', resources.length);
    resources.forEach(r => {
      console.log(`- ${r.title} (${r.status}) by ${r.uploadedBy?.name} (${r.uploadedBy?.role})`);
    });
    
    res.json({ success: true, resources, total: resources.length });
  } catch (error) {
    console.error('Error fetching all resources:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

export {
  uploadResource,
  getApprovedResources,
  getPendingResources,
  approveResource,
  rejectResource,
  deleteResource,
  getResourceById,
  getMyUploads,
  getStats,
  getAllResources
};