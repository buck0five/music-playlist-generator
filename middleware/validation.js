// middleware/validation.js

const { ContentLibrary } = require('../models');

/**
 * Validates content library creation/update payload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateContentLibrary = (req, res, next) => {
  const { name, description, userId, verticalId } = req.body;
  const errors = [];

  // Validate name
  if (!name) {
    errors.push('Library name is required');
  } else if (typeof name !== 'string' || name.length < 2) {
    errors.push('Library name must be at least 2 characters long');
  }

  // Validate description if provided
  if (description && (typeof description !== 'string' || description.length < 3)) {
    errors.push('Description must be at least 3 characters long');
  }

  // Validate userId if provided
  if (userId !== undefined && userId !== null && !Number.isInteger(Number(userId))) {
    errors.push('User ID must be a valid integer');
  }

  // Validate verticalId if provided
  if (verticalId !== undefined && verticalId !== null && !Number.isInteger(Number(verticalId))) {
    errors.push('Vertical ID must be a valid integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates library content operations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateLibraryContent = async (req, res, next) => {
  const { contentType, contentId } = req.body;
  const errors = [];

  // Validate content type
  if (!contentType) {
    errors.push('Content type is required');
  } else if (!['MUSIC', 'ADVERTISING', 'STATION'].includes(contentType)) {
    errors.push('Invalid content type. Must be MUSIC, ADVERTISING, or STATION');
  }

  // Validate content ID
  if (!contentId) {
    errors.push('Content ID is required');
  } else if (!Number.isInteger(Number(contentId))) {
    errors.push('Content ID must be a valid integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Validate library exists
  try {
    const library = await ContentLibrary.findByPk(req.params.id);
    if (!library) {
      return res.status(404).json({ error: 'Library not found' });
    }
    req.library = library;
    next();
  } catch (error) {
    console.error('Error validating library:', error);
    return res.status(500).json({ error: 'Error validating library access' });
  }
};

/**
 * Validates pagination parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Page must be a positive integer' });
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Limit must be a positive integer between 1 and 100' });
    }
  }

  next();
};

/**
 * Validates content removal request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateContentRemoval = (req, res, next) => {
  const { contentType, contentId } = req.body;
  const errors = [];

  // Validate content type
  if (!contentType) {
    errors.push('Content type is required');
  } else if (!['MUSIC', 'ADVERTISING', 'STATION'].includes(contentType)) {
    errors.push('Invalid content type. Must be MUSIC, ADVERTISING, or STATION');
  }

  // Validate content ID
  if (!contentId) {
    errors.push('Content ID is required');
  } else if (!Number.isInteger(Number(contentId))) {
    errors.push('Content ID must be a valid integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

/**
 * Validates ID parameter in URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }

  next();
};

module.exports = {
  validateContentLibrary,
  validateLibraryContent,
  validatePagination,
  validateContentRemoval,
  validateId
};
