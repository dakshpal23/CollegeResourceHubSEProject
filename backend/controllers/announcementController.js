import Announcement from '../models/Announcement.js';
import cloudinary from '../config/cloudinary.js';
import uploadToStorage from '../utils/uploadToStorage.js';

/**
 * Create announcement (admin only)
 */
const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const announcement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id,
    });

    await announcement.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Error creating announcement' });
  }
};

/**
 * Create announcement with file (admin only)
 */
const createAnnouncementWithFile = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;
    
    let fileUrl = null;
    if (file) {
      fileUrl = await uploadToStorage(file, 'announcements');
    }
    
    const announcement = await Announcement.create({
      title,
      content,
      fileUrl,
      createdBy: req.user._id,
    });

    await announcement.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Error creating announcement' });
  }
};

/**
 * Get all active announcements (public)
 */
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
};

/**
 * Delete announcement (admin only)
 */
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Error deleting announcement' });
  }
};

export {
  createAnnouncement,
  createAnnouncementWithFile,
  getAnnouncements,
  deleteAnnouncement,
};