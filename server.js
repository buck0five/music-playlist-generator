// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); //Import cors
const app = express();
const PORT = process.env.PORT || 5000;

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const sequelize = require('./config/database');

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);

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
