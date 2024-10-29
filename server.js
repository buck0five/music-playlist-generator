// server.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const apiRouter = require('./routes/api');
const { sequelize } = require('./models');

// Middleware and other setup...
app.use(express.json());
app.use('/api', apiRouter);

// Synchronize models and start the server
(async () => {
  try {
    // Disable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = OFF');

    // Synchronize models
    await sequelize.sync({ alter: true }); // or { force: true } if needed

    // Enable foreign key checks
    await sequelize.query('PRAGMA foreign_keys = ON');

    console.log('Database synchronized.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error synchronizing database:', err);
  }
})();
