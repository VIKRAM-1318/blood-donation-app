const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');
const Donor = require('../models/Donor');

/**
 * Generate a JWT token for a user.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'lifelink_default_jwt_secret_key_2026', {
    expiresIn: '7d',
  });
};

/**
 * Validation rules for registration.
 */
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

/**
 * Validation rules for login.
 */
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, password, phone, bloodGroup, district, city, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Determine normalized role
    const normalizedRole = role === 'Requester' ? 'Requester' : (role === 'Admin' ? 'Admin' : 'Donor');

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      bloodGroup: bloodGroup || '',
      district: district || 'Colombo',
      city: city || '',
      role: normalizedRole,
      status: 'Active',
      isActive: true,
      isVerified: false,
    });

    // If registered as Donor, also create Donor record so they are searchable immediately
    if (normalizedRole === 'Donor' && bloodGroup) {
      try {
        await Donor.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '0771234567',
          bloodGroup: user.bloodGroup,
          district: user.district || 'Colombo',
          city: user.city || user.district || 'Colombo',
          availability: true,
          status: 'Active',
        });
      } catch (donorErr) {
        console.error('Auto-donor creation notice:', donorErr.message);
      }
    }

    // Generate token and respond
    const token = generateToken(user._id);

    const userPayload = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bloodGroup: user.bloodGroup,
      district: user.district,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };

    res.status(201).json({
      ...userPayload,
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

/**
 * @desc    Login user & return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check account status
    if (user.status === 'Suspended' || user.isActive === false) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact an administrator.' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id);

    const userPayload = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bloodGroup: user.bloodGroup,
      district: user.district,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };

    res.json({
      ...userPayload,
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userPayload = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bloodGroup: user.bloodGroup,
      district: user.district,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };

    res.json({
      ...userPayload,
      user: userPayload,
    });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
};
