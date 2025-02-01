// server.js
const express = require('express');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Mount /api routes
app.use('/api', apiRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Music Playlist Generator API is running...');
});

// Start server on port 5000
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Database connection error:', err));
