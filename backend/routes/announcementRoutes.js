import express from 'express';
import {
  createAnnouncement,
  createAnnouncementWithFile,
  getAnnouncements,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAnnouncements);

// Admin only routes
router.post('/', protect, admin, createAnnouncement);
router.post('/with-file', protect, admin, upload.single('file'), createAnnouncementWithFile);
router.delete('/:id', protect, admin, deleteAnnouncement);

export default router;