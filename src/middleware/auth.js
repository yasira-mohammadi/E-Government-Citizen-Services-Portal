const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.session.token;
  if (!token) {
    req.flash('error', 'No token provided');
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
    next();
  } catch (err) {
    req.flash('error', 'Invalid token');
    res.redirect('/auth/login');
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash('error', 'Access denied');
      return res.redirect('/');
    }
    next();
  };
};

module.exports = { authenticate, restrictTo };