// middleware/auth.js

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variables in production

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  // Extract the token from the header (Bearer TOKEN)
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    // Fetch user role from database
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticate;
