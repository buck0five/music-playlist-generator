// server.js

require('dotenv').config(); // Load environment variables
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const { sequelize } = require('./models');

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

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
})();
