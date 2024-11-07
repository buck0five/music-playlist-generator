// middleware/authorize.js

const authorize = (roles = []) => {
  // roles param can be a single role string or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // User's role is not authorized
      return res.status(403).json({ error: 'Forbidden: Access is denied.' });
    }
    next();
  };
};

module.exports = authorize;
