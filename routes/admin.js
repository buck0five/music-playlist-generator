// routes/admin.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { User, ContentLibrary, Content } = require('../models');

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Access is denied.' });
  }
  next();
};

// Admin Dashboard
router.get('/dashboard', authenticate, isAdmin, (req, res) => {
  res.json({
    message: 'Welcome to the admin dashboard.',
    user: {
      id: req.user.id,
      role: req.user.role,
    },
  });
});

// Get All Users
router.get('/users', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role'],
    });

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

// Update User
router.put('/users/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});

// Delete User
router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});

// Create Content Library
router.post('/content-libraries', authenticate, isAdmin, async (req, res) => {
  const { name } = req.body;

  try {
    const contentLibrary = await ContentLibrary.create({ name });

    res.status(201).json({
      message: 'Content library created successfully.',
      contentLibrary,
    });
  } catch (err) {
    console.error('Error creating content library:', err);
    res.status(500).json({ error: 'An error occurred while creating the content library.' });
  }
});

// Get All Content Libraries
router.get('/content-libraries', authenticate, isAdmin, async (req, res) => {
  try {
    const contentLibraries = await ContentLibrary.findAll();

    res.json(contentLibraries);
  } catch (err) {
    console.error('Error fetching content libraries:', err);
    res.status(500).json({ error: 'An error occurred while fetching content libraries.' });
  }
});

// Create Content
router.post('/contents', authenticate, isAdmin, async (req, res) => {
  const { title, contentType, file_path, duration, tags } = req.body;

  try {
    const content = await Content.create({
      title,
      contentType,
      file_path,
      duration,
      tags,
    });

    res.status(201).json({
      message: 'Content created successfully.',
      content,
    });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'An error occurred while creating content.' });
  }
});

// Assign Content to Content Library
router.post(
  '/content-libraries/:libraryId/contents/:contentId',
  authenticate,
  isAdmin,
  async (req, res) => {
    const { libraryId, contentId } = req.params;

    try {
      const contentLibrary = await ContentLibrary.findByPk(libraryId);
      const content = await Content.findByPk(contentId);

      if (!contentLibrary || !content) {
        return res.status(404).json({ error: 'Content or Content Library not found.' });
      }

      await contentLibrary.addContent(content);

      res.json({ message: 'Content added to content library successfully.' });
    } catch (err) {
      console.error('Error assigning content to library:', err);
      res.status(500).json({ error: 'An error occurred while assigning content.' });
    }
  }
);

module.exports = router;
