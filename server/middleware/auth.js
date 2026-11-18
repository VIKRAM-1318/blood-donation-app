const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization Bearer header and attaches user to req.user.
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is valid but user no longer exists.' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'Account has been suspended. Contact an administrator.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};

/**
 * Admin authorization middleware.
 * Must be used after the `auth` middleware.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
};

module.exports = { auth, admin };
