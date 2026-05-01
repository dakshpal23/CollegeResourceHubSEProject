import Announcement from '../models/Announcement.js';
import cloudinary from '../config/cloudinary-fixed.js';

// Create announcement (admin only)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file;
    
    // Validate: must have either content or file (or both)
    if (!title || (!content && !file)) {
      return res.status(400).json({ message: 'Title and either content or file is required' });
    }
    
    let fileUrl = null;
    if (file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: 'auto', 
            folder: 'announcements'
          },
          (error, result) => error ? reject(error) : resolve(result)
        ).end(file.buffer);
      });
      fileUrl = result.secure_url;
    }
    
    const announcement = await Announcement.create({
      title,
      content: content || '',
      fileUrl,
      createdBy: req.user._id
    });

    await announcement.populate('createdBy', 'name');
    res.status(201).json({ success: true, message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
};

// Get all active announcements (public)
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
};

// Delete announcement (admin only)
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement' });
  }
};

export { createAnnouncement, getAnnouncements, deleteAnnouncement };