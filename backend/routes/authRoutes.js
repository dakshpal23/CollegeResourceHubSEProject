import express from 'express';
import { register, login, createBranchAdmin } from '../controllers/authController.js';
import { protect, superAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', protect, superAdmin, createBranchAdmin);

export default router;