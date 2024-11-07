// routes/admin.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { User, Platform, Company, Station, ContentLibrary, Content } = require('../models');

// Apply authentication and authorization middleware to all routes in this router
router.use(authenticate);
router.use(authorize('admin'));

// Admin Dashboard
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard.', user: req.user });
});

// Manage Users

// Get all users
router.get('/users', async (req, res) => {
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

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
});

// Manage Content Libraries

// Get all content libraries
router.get('/content-libraries', async (req, res) => {
  try {
    const contentLibraries = await ContentLibrary.findAll();
    res.json(contentLibraries);
  } catch (err) {
    console.error('Error fetching content libraries:', err);
    res.status(500).json({ error: 'An error occurred while fetching content libraries.' });
  }
});

// Create a new content library
router.post('/content-libraries', async (req, res) => {
  try {
    const { name } = req.body;
    const contentLibrary = await ContentLibrary.create({ name });
    res.status(201).json({ message: 'Content library created successfully.', contentLibrary });
  } catch (err) {
    console.error('Error creating content library:', err);
    res.status(500).json({ error: 'An error occurred while creating the content library.' });
  }
});

// Manage Content

// Get all content
router.get('/contents', async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'An error occurred while fetching content.' });
  }
});

// Create new content
router.post('/contents', async (req, res) => {
  try {
    const { title, contentType, file_path, duration, tags } = req.body;
    const content = await Content.create({ title, contentType, file_path, duration, tags });
    res.status(201).json({ message: 'Content created successfully.', content });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'An error occurred while creating the content.' });
  }
});

// Assign content to a content library
router.post('/content-libraries/:libraryId/contents/:contentId', async (req, res) => {
  try {
    const { libraryId, contentId } = req.params;
    const contentLibrary = await ContentLibrary.findByPk(libraryId);
    const content = await Content.findByPk(contentId);

    if (!contentLibrary || !content) {
      return res.status(404).json({ error: 'Content library or content not found.' });
    }

    await contentLibrary.addContent(content);
    res.json({ message: 'Content added to content library successfully.' });
  } catch (err) {
    console.error('Error assigning content to content library:', err);
    res.status(500).json({ error: 'An error occurred while assigning content.' });
  }
});

// Additional admin routes can be added below...

module.exports = router;
