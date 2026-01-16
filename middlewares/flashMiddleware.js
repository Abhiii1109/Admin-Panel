/**
 * Flash Message Middleware
 * Makes flash messages available to all views
 */
const flashMiddleware = (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.adminName = req.session.adminName || null;
  res.locals.adminEmail = req.session.adminEmail || null;
  res.locals.adminImage = req.session.adminImage || null;
  next();
};

module.exports = flashMiddleware;
