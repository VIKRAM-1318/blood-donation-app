const User = require('../models/User');

/**
 * @desc    Get all users with pagination (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('GetUsers error:', error.message);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

/**
 * @desc    Get a single user by ID (admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('GetUserById error:', error.message);
    res.status(500).json({ message: 'Server error fetching user.' });
  }
};

/**
 * @desc    Update user status (admin only)
 * @route   PUT /api/users/:id/status
 * @access  Private/Admin
 */
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "Active" or "Suspended".' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from suspending themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own status.' });
    }

    user.status = status;
    await user.save();

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('UpdateUserStatus error:', error.message);
    res.status(500).json({ message: 'Server error updating user status.' });
  }
};

/**
 * @desc    Delete a user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account from here.' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed successfully.' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.error('DeleteUser error:', error.message);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
