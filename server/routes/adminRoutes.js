const express = require('express');
const { auth, admin } = require('../middleware/auth');
const {
  getAdminStats,
  toggleUserStatus,
  verifyDonor,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/', auth, admin, getAdminStats);
router.patch('/verify/:id', auth, admin, verifyDonor);
router.patch('/toggle-status/:id', auth, admin, toggleUserStatus);

module.exports = router;
