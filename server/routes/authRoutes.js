const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
} = require('../controllers/authController');

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/me
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;
