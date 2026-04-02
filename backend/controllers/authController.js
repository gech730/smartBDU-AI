import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, interests, favoriteSubjects, goals } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      interests: interests || [],
      favoriteSubjects: favoriteSubjects || [],
      goals: goals || []
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      interests: user.interests,
      favoriteSubjects: user.favoriteSubjects,
      goals: user.goals,
      theme: user.theme,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        favoriteSubjects: user.favoriteSubjects,
        goals: user.goals,
        theme: user.theme,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, interests, favoriteSubjects, goals, theme } = req.body;

    const user = await User.findById(req.user._id);
    if (user) {
      user.name = name || user.name;
      user.interests = interests || user.interests;
      user.favoriteSubjects = favoriteSubjects || user.favoriteSubjects;
      user.goals = goals || user.goals;
      if (theme) user.theme = theme;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        interests: updatedUser.interests,
        favoriteSubjects: updatedUser.favoriteSubjects,
        goals: updatedUser.goals,
        theme: updatedUser.theme
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};