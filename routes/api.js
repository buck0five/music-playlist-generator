// routes/api.js

const express = require('express');
const router = express.Router();
const generatePlaylist = require('../generatePlaylist');
const { Content, Feedback, Format } = require('../models'); // Added Format here

// Route handler for generating the playlist based on preferred formats
router.post('/preferences', async (req, res) => {
  try {
    let { preferredFormats } = req.body;

    if (!preferredFormats || !Array.isArray(preferredFormats)) {
      return res.status(400).json({ error: 'preferredFormats must be an array of format IDs.' });
    }

    // Convert format IDs to integers
    preferredFormats = preferredFormats.map(id => parseInt(id, 10));

    // Generate the playlist
    const playlistPath = await generatePlaylist(preferredFormats);

    res.json({ message: 'Playlist generated successfully!', playlistPath });
  } catch (err) {
    console.error('Error generating playlist:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route handler for submitting feedback
router.post('/feedback', async (req, res) => {
  try {
    const { contentId, feedbackType } = req.body;

    if (!contentId || !feedbackType) {
      return res.status(400).json({ error: 'contentId and feedbackType are required.' });
    }

    // Create a new feedback entry
    await Feedback.create({
      contentId,
      feedbackType,
      timestamp: new Date(),
    });

    res.json({ message: 'Feedback submitted successfully!' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route handler for retrieving all content
router.get('/contents', async (req, res) => {
  try {
    const contents = await Content.findAll();
    res.json(contents);
  } catch (err) {
    console.error('Error fetching contents:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route handler for retrieving formats
router.get('/formats', async (req, res) => {
  try {
    const formats = await Format.findAll();
    res.json(formats);
  } catch (err) {
    console.error('Error fetching formats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export the router to be used in server.js
module.exports = router;
