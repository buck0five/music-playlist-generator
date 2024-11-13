// routes/api.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { User } = require('../models');
const generatePlaylist = require('../generatePlaylist');

// Get User Profile
router.get('/user/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role'],
    });

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'An error occurred while fetching the profile.' });
  }
});

// Update User Profile
router.put('/user/profile', authenticate, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'An error occurred while updating the profile.' });
  }
});

// Generate Playlist
router.get('/playlists/generate', authenticate, async (req, res) => {
  try {
    const playlistPath = await generatePlaylist(req.user.id);
    res.json({ message: 'Playlist generated successfully.', path: playlistPath });
  } catch (err) {
    console.error('Error generating playlist:', err);
    res.status(500).json({ error: 'An error occurred while generating the playlist.' });
  }
});

module.exports = router;
