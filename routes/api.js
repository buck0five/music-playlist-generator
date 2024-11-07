// routes/api.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { User, Content, ContentLibrary, Station } = require('../models');

// Import other necessary modules or controllers here

// Public Routes (No authentication required)

// Example: Get public content
router.get('/public-content', async (req, res) => {
  try {
    const contents = await Content.findAll({ where: { isPublic: true } });
    res.json(contents);
  } catch (err) {
    console.error('Error fetching public content:', err);
    res.status(500).json({ error: 'An error occurred while fetching public content.' });
  }
});

// Protected Routes (Authentication required)

// Example: Get user profile
router.get('/user/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role'],
    });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'An error occurred while fetching user profile.' });
  }
});

// Example: Update user profile
router.put('/user/profile', authenticate, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // Password hashing handled in model hook

    await user.save();
    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'An error occurred while updating user profile.' });
  }
});

// Example: Generate playlist for authenticated user
router.get('/playlists/generate', authenticate, async (req, res) => {
  try {
    const generatePlaylist = require('../generatePlaylist');
    const playlistPath = await generatePlaylist(req.user.id);
    res.json({ message: 'Playlist generated successfully.', path: playlistPath });
  } catch (err) {
    console.error('Error generating playlist:', err);
    res.status(500).json({ error: 'An error occurred while generating the playlist.' });
  }
});

// Example: Get user's stations
router.get('/user/stations', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Station,
          as: 'AssignedStations',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json(user.AssignedStations);
  } catch (err) {
    console.error('Error fetching user stations:', err);
    res.status(500).json({ error: 'An error occurred while fetching user stations.' });
  }
});

// Additional routes can be added below...

module.exports = router;
