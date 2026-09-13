import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const register = async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      branch,
      role: 'student'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Super Admin login
    if (email === 'superadmin@college.edu' && password === 'SuperAdmin123!') {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: 'Super Admin',
          email,
          password,
          role: 'super_admin',
          branch: 'CSE'
        });
      }

      const token = generateToken(user._id);
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          branch: user.branch
        },
        token
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const createBranchAdmin = async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admin can create branch admins' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'branch_admin',
      branch
    });

    res.status(201).json({
      success: true,
      message: `Branch admin created for ${branch}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin creation' });
  }
};

export { register, login, createBranchAdmin };