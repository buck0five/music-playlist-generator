// routes/api.js

const express = require('express');
const router = express.Router();

// Existing route imports from your main branch
const stationRoutes = require('./station');
const stationProfileRoutes = require('./stationProfile');
const stationScheduleRoutes = require('./stationSchedule');
const clockTemplateRoutes = require('./clockTemplate');
const contentCrudRoutes = require('./contentCrudRoutes');
const cartCrudRoutes = require('./cartCrudRoutes');
const tagRoutes = require('./tag');
const stationTagPreferenceRoutes = require('./stationTagPreference');
const reportRoutes = require('./reportRoutes');
const onDemandRoutes = require('./onDemandRoutes');
const clockMapRoutes = require('./clockMapRoutes');
const { generatePlaylistForStation } = require('../generatePlaylist');
const Feedback = require('../models/Feedback');
const contentLibraryRoutes = require('./contentLibraryRoutes');
const verticalRoutes = require('./verticalRoutes');
const userRoutes = require('./userRoutes');


// Station
if (stationRoutes) router.use('/stations', stationRoutes);
if (stationProfileRoutes) router.use('/station-profiles', stationProfileRoutes);
if (stationScheduleRoutes) router.use('/station-schedules', stationScheduleRoutes);

// Clock Templates
if (clockTemplateRoutes) router.use('/clock-templates', clockTemplateRoutes);

// Carts & Content
router.use('/carts', cartCrudRoutes);
router.use('/content', contentCrudRoutes);

// Tagging
if (tagRoutes) router.use('/tags', tagRoutes);
if (stationTagPreferenceRoutes) {
  router.use('/station-tag-preference', stationTagPreferenceRoutes);
}

// Reports
if (reportRoutes) router.use('/reports', reportRoutes);

// On-Demand
if (onDemandRoutes) router.use('/on-demand', onDemandRoutes);

// Clock Maps
router.use('/clock-maps', clockMapRoutes);

// Content Libraries
router.use('/content-libraries', contentLibraryRoutes);

// Vertical Routes
router.use('/verticals', verticalRoutes);

// User Routes
router.use('/users', userRoutes);

// Example generate-playlist
router.post('/generate-playlist', async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) return res.status(400).json({ error: 'stationId required' });
    const playlist = await generatePlaylistForStation(stationId);
    res.json({ success: true, message: 'Playlist generated', playlist });
  } catch (err) {
    console.error('Error generating playlist:', err);
    res.status(500).json({ error: 'Error generating playlist' });
  }
});

// Example feedback
router.post('/feedback', async (req, res) => {
  try {
    const { stationId, contentId, feedbackType } = req.body;
    if (!stationId || !contentId || !feedbackType) {
      return res
        .status(400)
        .json({ error: 'stationId, contentId, feedbackType required' });
    }
    await Feedback.create({ stationId, contentId, feedbackType });
    res.json({ success: true, message: 'Feedback recorded' });
  } catch (err) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Error recording feedback' });
  }
});

module.exports = router;
