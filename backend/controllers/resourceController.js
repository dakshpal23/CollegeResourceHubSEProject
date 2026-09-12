import Resource from '../models/Resource.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import uploadToStorage from '../utils/uploadToStorage.js';

/**
 * Upload a new resource (student/admin)
 * POST /api/resource/upload or /api/resource/admin/upload
 */
const uploadResource = async (req, res) => {
  try {
    const { title, description, branch, subject } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Get file extension for type determination
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    
    // Upload file to Cloudinary when configured; otherwise store locally for dev
    const uploadedUrl = await uploadToStorage(file, 'college-resources');

    // Admin uploads are auto-approved, student uploads need approval
    const status = req.user.role === 'admin' ? 'approved' : 'pending';
    const message = req.user.role === 'admin' 
      ? 'Resource uploaded and approved successfully.' 
      : 'Resource uploaded successfully. Waiting for admin approval.';

    // Create resource entry
    const resource = await Resource.create({
      title,
      description,
      branch,
      subject,
      fileUrl: uploadedUrl,
      fileType: fileExtension,
      uploadedBy: req.user._id,
      status
    });

    // Populate user info
    await resource.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message,
      resource,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading resource' });
  }
};

/**
 * Get all approved resources (public)
 * GET /api/resource/approved
 */
const getApprovedResources = async (req, res) => {
  try {
    const { search, branch, subject, sort = 'newest' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'approved' };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    // Add branch filter
    if (branch && branch !== 'all') {
      query.branch = branch;
    }

    // Add subject filter
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'popular':
        sortOption = { downloadCount: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

/**
 * Get pending resources (admin only)
 * GET /api/resource/pending
 */
const getPendingResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const resources = await Resource.find({ status: 'pending' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get pending resources error:', error);
    res.status(500).json({ message: 'Error fetching pending resources' });
  }
};

/**
 * Approve a resource (admin only)
 * PUT /api/resource/approve/:id
 */
const approveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.status = 'approved';
    resource.adminRemark = req.body.remark || '';
    await resource.save();

    await resource.populate('uploadedBy', 'name email');

    res.json({
      success: true,
      message: 'Resource approved successfully',
      resource,
    });
  } catch (error) {
    console.error('Approve resource error:', error);
    res.status(500).json({ message: 'Error approving resource' });
  }
};

/**
 * Reject a resource (admin only)
 * PUT /api/resource/reject/:id
 */
const rejectResource = async (req, res) => {
  try {
    const { remark } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.status = 'rejected';
    resource.adminRemark = remark || 'No reason provided';
    await resource.save();

    await resource.populate('uploadedBy', 'name email');

    res.json({
      success: true,
      message: 'Resource rejected successfully',
      resource,
    });
  } catch (error) {
    console.error('Reject resource error:', error);
    res.status(500).json({ message: 'Error rejecting resource' });
  }
};

/**
 * Delete a resource (admin only)
 * DELETE /api/resource/:id
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Delete from Cloudinary
    const publicId = resource.fileUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`college-resources/${publicId}`);

    // Delete from database
    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
};

/**
 * Get single resource by ID
 * GET /api/resource/:id
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count if resource is approved
    if (resource.status === 'approved') {
      resource.downloadCount += 1;
      await resource.save();
    }

    res.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Error fetching resource' });
  }
};

/**
 * Get user's uploaded resources
 * GET /api/resource/my-uploads
 */
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
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get my uploads error:', error);
    res.status(500).json({ message: 'Error fetching your uploads' });
  }
};

/**
 * Get dashboard stats (admin only)
 * GET /api/resource/stats
 */
const getStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments({ status: 'approved' });
    const pendingResources = await Resource.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments({ role: 'student' });
    
    // Get resources by branch
    const resourcesByBranch = await Resource.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get most downloaded resources
    const popularResources = await Resource.find({ status: 'approved' })
      .populate('uploadedBy', 'name')
      .sort({ downloadCount: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalResources,
        pendingResources,
        totalUsers,
        resourcesByBranch,
        popularResources,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
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
};