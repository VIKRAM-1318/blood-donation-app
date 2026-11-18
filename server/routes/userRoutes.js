const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} = require('../controllers/userController');

// All routes require authentication + admin role
router.use(auth, admin);

// @route   GET /api/users
// @access  Private/Admin
router.get('/', getUsers);

// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', getUserById);

// @route   PUT /api/users/:id/status
// @access  Private/Admin
router.put('/:id/status', updateUserStatus);

// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', deleteUser);

module.exports = router;
