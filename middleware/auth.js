// middleware/auth.js

/**
 * Middleware to check if the user has the required permissions
 * For development/testing, this is simplified to always grant access
 * @param {string|string[]} requiredPermissions - The permission(s) required to access the route
 * @returns {function} Express middleware function
 */
const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    // Development bypass: Create a mock user with all permissions
    req.user = {
      id: 1,
      username: 'buck0five',
      // Add any permissions that your routes check for
      permissions: [
        'playlist.generate',
        'content.read',
        'content.write',
        'station.manage',
        'library.access'
      ]
    };

    // Log for debugging purposes
    console.log(`Access granted to route requiring: ${requiredPermissions}`);
    console.log(`User: ${req.user.username}`);

    next();
  };
};

/**
 * Simplified authentication middleware that bypasses JWT verification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateUser = (req, res, next) => {
  // Development bypass: Set a default authenticated user
  req.user = {
    id: 1,
    username: 'buck0five',
    permissions: [
      'playlist.generate',
      'content.read',
      'content.write',
      'station.manage',
      'library.access'
    ]
  };

  // Log for debugging purposes
  console.log('User automatically authenticated:', req.user.username);
  
  next();
};

module.exports = {
  checkPermissions,
  authenticateUser
};
