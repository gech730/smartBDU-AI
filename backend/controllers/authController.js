import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { universityId, email, password, name, role, department, yearOfStudy, program, phone } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { universityId }] });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        error: userExists.email === email ? 'Email already registered' : 'University ID already registered' 
      });
    }

    const user = await User.create({
      universityId,
      email,
      password,
      name,
      role: role || 'student',
      department,
      yearOfStudy,
      program: program || 'undergraduate',
      phone
    });

    const token = generateToken(user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message).join(', ');
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, universityId } = req.body;

    let user;
    if (universityId) {
      user = await User.findOne({ universityId });
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'bio', 'avatar', 'interests', 'favoriteSubjects', 'goals', 'skills'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDirectory = async (req, res) => {
  try {
    const { search, department, role, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { universityId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password -notifications')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
