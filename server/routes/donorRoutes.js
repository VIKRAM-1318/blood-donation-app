const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  updateDonorStatus,
  deleteDonor,
} = require('../controllers/donorController');

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return auth(req, res, next);
  }
  next();
};

// @route   GET /api/donors
router.get('/', getDonors);

// @route   GET /api/donors/:id
router.get('/:id', getDonorById);

// @route   POST /api/donors
router.post('/', optionalAuth, createDonor);

// @route   PUT /api/donors/:id
router.put('/:id', auth, updateDonor);

// @route   PUT /api/donors/:id/status
router.put('/:id/status', auth, updateDonorStatus);
router.patch('/:id/status', auth, updateDonorStatus);

// @route   DELETE /api/donors/:id
router.delete('/:id', auth, deleteDonor);

module.exports = router;
