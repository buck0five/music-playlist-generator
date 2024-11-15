// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const helmet = require('helmet'); // Security middleware
const compression = require('compression'); // Compression middleware
const app = express();
const PORT = process.env.PORT || 5000;

const sequelize = require('./config/database');

// Import middleware
const authenticate = require('./middleware/authenticate'); // Updated authenticate middleware

// Import routers
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const adminRouter = require('./routes/admin');

// Enable CORS for all routes
app.use(cors());

// Security Middleware
app.use(helmet());

// Compression Middleware
app.use(compression());

// Middleware
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Public Routes
app.use('/auth', authRouter);

// Protected Routes
app.use('/api', authenticate, apiRouter);

// Admin Routes (authentication and authorization are handled within adminRouter)
app.use('/admin', adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// Start the server
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
})();
