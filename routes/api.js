// routes/api.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const stationRoutes = require('./station');
const stationProfileRoutes = require('./stationProfile');
const stationScheduleRoutes = require('./stationSchedule');
const clockTemplateRoutes = require('./clockTemplate');
const cartRoutes = require('./cart');
const contentTypeRoutes = require('./contentType');

const { Feedback } = require('../models');
const { generatePlaylistForStation } = require('../generatePlaylist');

const contentRoutes = require('./content');

// Mount sub-routes
router.use('/stations', stationRoutes);
router.use('/station-profiles', stationProfileRoutes);
router.use('/station-schedules', stationScheduleRoutes);
router.use('/clock-templates', clockTemplateRoutes);
router.use('/carts', cartRoutes);
router.use('/content-types', contentTypeRoutes);
router.use('/content', contentRoutes);


// Example POST /api/feedback
router.post('/feedback', async (req, res) => {
  try {
    const { contentId, feedbackType } = req.body;
    if (!contentId || !feedbackType) {
      return res.status(400).json({ error: 'Missing contentId or feedbackType.' });
    }
    await Feedback.create({ contentId, feedbackType });
    res.json({ success: true, message: 'Feedback recorded.' });
  } catch (err) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Error recording feedback.' });
  }
});

// Example GET /api/live-playlist - if you had a single global playlist?
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

// POST /api/generate-playlist
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
