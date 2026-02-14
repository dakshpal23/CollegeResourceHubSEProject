import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware to check if user is admin (legacy)
 */
const admin = (req, res, next) => {
  console.log('Admin middleware - User:', req.user?.email, 'Role:', req.user?.role);
  if (req.user && (req.user.role === 'admin' || req.user.role === 'branch_admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

/**
 * Middleware to check if user is branch admin
 */
const branchAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'branch_admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Branch admin role required.' });
  }
};

/**
 * Middleware to check if user is super admin
 */
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super admin role required.' });
  }
};

/**
 * Middleware to check if user is student
 */
const student = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Student role required.' });
  }
};

export { protect, admin, student, branchAdmin, superAdmin };