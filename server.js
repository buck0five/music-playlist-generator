// server.js
const express = require('express');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Attach /api routes
app.use('/api', apiRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Music Playlist Generator API is running...');
});

// Start server & sync database
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter:true }) // or .sync({ alter: true }) in dev mode
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Database connected successfully.');
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
