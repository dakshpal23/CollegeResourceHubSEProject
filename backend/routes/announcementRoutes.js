import express from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAnnouncements);

// Admin only routes
router.post('/', protect, admin, uploadSingle('file'), createAnnouncement);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;