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
  getAllResources
} from '../controllers/resourceController.js';
import { protect, admin, student, branchAdmin } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/approved', getApprovedResources);
router.get('/:id', getResourceById);

// User routes (students and admins can upload)
router.post('/upload', protect, uploadSingle('file'), uploadResource);
router.get('/my/uploads', protect, getMyUploads);

// Admin only routes
router.get('/admin/pending', protect, branchAdmin, getPendingResources);
router.get('/admin/stats', protect, branchAdmin, getStats);
router.get('/admin/all', protect, branchAdmin, getAllResources);
router.put('/approve/:id', protect, branchAdmin, approveResource);
router.put('/reject/:id', protect, branchAdmin, rejectResource);
router.delete('/:id', protect, branchAdmin, deleteResource);

export default router;