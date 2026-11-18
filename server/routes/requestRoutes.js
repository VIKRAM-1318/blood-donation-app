const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController');

// Optional auth helper: attaches user if token is present, but doesn't block if missing
const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return auth(req, res, next);
  }
  next();
};

// @route   GET /api/requests
router.get('/', getRequests);

// @route   GET /api/requests/:id
router.get('/:id', getRequestById);

// @route   POST /api/requests
router.post('/', optionalAuth, createRequest);

// @route   PATCH /api/requests/:id/status
router.patch('/:id/status', updateRequestStatus);

// @route   DELETE /api/requests/:id
router.delete('/:id', auth, deleteRequest);

module.exports = router;
