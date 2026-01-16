const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const flashMiddleware = require('./middlewares/flashMiddleware');

/**
 * Express Application Configuration
 */
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
    },
  })
);

// Flash messages
app.use(flash());

// Flash middleware (make flash messages available to all views)
app.use(flashMiddleware);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/category', require('./routes/categoryRoutes'));
app.use('/subcategory', require('./routes/subcategoryRoutes'));
app.use('/extra-category', require('./routes/extraCategoryRoutes'));
app.use('/profile', require('./routes/profileRoutes'));

// Home route - redirect to dashboard or login
app.get('/', (req, res) => {
  if (req.session.adminId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('500', { title: 'Server Error', error: err.message });
});

module.exports = app;
