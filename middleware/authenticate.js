// middleware/authenticate.js

const { verifyToken } = require('../utils/token');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing.' });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  req.user = {
    id: payload.id,
    role: payload.role,
  };

  next();
};

module.exports = authenticate;
