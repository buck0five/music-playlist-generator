// routes/api.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Import routes we created previously
const stationRoutes = require('./station');
const clockTemplateRoutes = require('./clockTemplate');
const cartRoutes = require('./cart');
const contentTypeRoutes = require('./contentType');
const stationProfileRoutes = require('./stationProfile');

// If you have your generatePlaylist logic in generatePlaylist.js:
const { generatePlaylist, updateContentScores, generatePlaylistForStation } = require('../generatePlaylist');
const { Feedback } = require('../models');

// Attach each sub-route under /api
router.use('/stations', stationRoutes); // e.g. GET/PUT/POST/DELETE /api/stations
router.use('/clock-templates', clockTemplateRoutes); // /api/clock-templates
router.use('/carts', cartRoutes); // /api/carts
router.use('/content-types', contentTypeRoutes); // /api/content-types
router.use('/station-profiles', stationProfileRoutes); // /api/station-profiles

// Example POST /api/preferences - basic example from earlier
router.post('/preferences', async (req, res) => {
  try {
    const { preferredFormats } = req.body;
    await generatePlaylist(preferredFormats || []);
    res.json({ success: true, message: 'Playlist generated.' });
  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).json({ error: 'Error generating playlist.' });
  }
});

// Example POST /api/feedback
router.post('/feedback', async (req, res) => {
  try {
    const { contentId, feedbackType } = req.body;
    if (!contentId || !feedbackType) {
      return res.status(400).json({ error: 'Missing contentId or feedbackType.' });
    }
    await Feedback.create({ contentId, feedbackType });
    res.json({ success: true, message: 'Feedback recorded.' });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ error: 'Error recording feedback.' });
  }
});

// GET /api/live-playlist
router.get('/live-playlist', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'playlist.m3u');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'No playlist found.' });
    }
    const m3uContent = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'audio/x-mpegurl');
    res.send(m3uContent);
  } catch (error) {
    console.error('Error retrieving playlist:', error);
    res.status(500).json({ error: 'Error retrieving playlist.' });
  }
});

// OPTIONAL: A route to generate a playlist for a specific station
// if you are using "generatePlaylistForStation"
router.post('/generate-playlist', async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }
    const playlist = await generatePlaylistForStation(stationId);
    res.json({ success: true, message: 'Playlist generated.', playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    res.status(500).json({ error: 'Error generating playlist.' });
  }
});

module.exports = router;
