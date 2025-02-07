// server.js
const express = require('express');
const cors = require('cors'); // import cors
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();

// Enable JSON parsing
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Mount /api routes
app.use('/api', apiRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Music Playlist Generator API is running...');
});

// Start server on port 5000
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Database connection error:', err));
