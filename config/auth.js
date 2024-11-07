// config/auth.js

require('dotenv').config(); // Load environment variables

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
