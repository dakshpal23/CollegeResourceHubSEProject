import express from 'express';
import {
  uploadResource,
  getApprovedResources,
  getPendingResources,
  approveResource,
  rejectResource,
  deleteResource,
  getResourceById,
  getMyUploads,
  getStats,
} from '../controllers/resourceController.js';
import { protect, admin, student } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedResources);
router.get('/:id', getResourceById);

// Protected routes - Student only
router.post('/upload', protect, student, upload.single('file'), uploadResource);
router.get('/my/uploads', protect, student, getMyUploads);

// Protected routes - Admin only
router.post('/admin/upload', protect, admin, upload.single('file'), uploadResource);
router.get('/admin/pending', protect, admin, getPendingResources);
router.get('/admin/stats', protect, admin, getStats);
router.put('/approve/:id', protect, admin, approveResource);
router.put('/reject/:id', protect, admin, rejectResource);
router.delete('/:id', protect, admin, deleteResource);

export default router;