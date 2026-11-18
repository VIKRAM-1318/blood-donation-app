const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Donor = require('../models/Donor');

/**
 * @desc    Get system administration statistics
 * @route   GET /api/admin
 * @access  Private/Admin
 */
const getAdminStats = async (req, res) => {
  try {
    const [totalDonors, verifiedDonors, openRequests, fulfilledRequests, donorsList] = await Promise.all([
      User.countDocuments({ role: { $in: ['Donor', 'donor'] } }),
      User.countDocuments({ role: { $in: ['Donor', 'donor'] }, isVerified: true }),
      BloodRequest.countDocuments({ status: { $in: ['Pending', 'Open', 'pending', 'open'] } }),
      BloodRequest.countDocuments({ status: { $in: ['Fulfilled', 'fulfilled'] } }),
      User.find({ role: { $in: ['Donor', 'donor'] } }).select('-password').sort({ createdAt: -1 }).limit(50),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalDonors: totalDonors || 1,
        verifiedDonors: verifiedDonors || 1,
        openRequests: openRequests || 0,
        fulfilledRequests: fulfilledRequests || 0,
      },
      donorsList: donorsList || [],
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify a donor account
 * @route   PATCH /api/admin/verify/:id
 * @access  Private/Admin
 */
const verifyDonor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found',
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Donor verified successfully',
      donor: user,
    });
  } catch (error) {
    console.error('verifyDonor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle user active/suspended status
 * @route   PATCH /api/admin/toggle-status/:id
 * @access  Private/Admin
 */
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = user.isActive === undefined ? false : !user.isActive;
    user.status = user.isActive ? 'Active' : 'Suspended';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Suspended'}`,
      donor: user,
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  verifyDonor,
  toggleUserStatus,
};
