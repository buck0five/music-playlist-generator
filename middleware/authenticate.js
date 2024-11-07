// middleware/authenticate.js

const { verifyToken } = require('../utils/token');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if authorization header is present
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing.' });
  }

  // Extract token from header (Bearer TOKEN)
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing.' });
  }

  // Verify token
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  // Attach user info to request object
  req.user = {
    id: payload.id,
    role: payload.role,
  };

  next();
};

module.exports = authenticate;
