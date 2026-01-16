/**
 * Authentication Middleware
 * Protects routes from unauthorized access
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.flash('error', 'Please login to access this page');
  res.redirect('/auth/login');
};

/**
 * Redirect if already authenticated
 */
const isGuest = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/dashboard');
  }
  next();
};

module.exports = { isAuthenticated, isGuest };
