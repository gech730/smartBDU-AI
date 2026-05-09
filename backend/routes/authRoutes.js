import express from 'express';
import { body, check, validationResult } from 'express-validator';
import { register, login, getProfile, updateProfile, getDirectory } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerValidation = [
  check('universityId')
    .notEmpty().withMessage('University ID is required')
    .matches(/^BDU\d{7}$/).withMessage('University ID must be in format BDU1234567'),
  check('name')
    .notEmpty().withMessage('Full name is required'),
  check('email')
    .isEmail().withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin']).withMessage('Invalid role'),
  body('department')
    .if(body('role').not().equals('admin'))
    .notEmpty().withMessage('Department is required for student and faculty'),
  body('yearOfStudy')
    .optional()
    .isInt({ min: 1, max: 6 }).withMessage('Year of study must be between 1 and 6'),
  body('program')
    .optional()
    .isIn(['undergraduate', 'masters', 'phd']).withMessage('Invalid program'),
  validateRequest
];

const loginValidation = [
  check('password').notEmpty().withMessage('Password is required'),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.universityId) {
      throw new Error('Email or University ID is required');
    }
    return true;
  }),
  validateRequest
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/directory', protect, getDirectory);

export default router;
