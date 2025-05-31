const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: 'Not authorized, no token'
    });
  }
};

// Middleware to check if user is the owner of a resource
const checkOwnership = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Check if the authenticated user is the owner
    if (resource.createdBy && resource.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        error: 'Not authorized to perform this action'
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error'
    });
  }
};

module.exports = { protect, checkOwnership };