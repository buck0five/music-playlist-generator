// routes/api.js

const express = require('express');
const router = express.Router();

const contentCrudRoutes = require('./contentCrudRoutes');
// e.g. if you have cartCrudRoutes:
const cartCrudRoutes = require('./cartCrudRoutes');
// other optional routes:
const stationRoutes = require('./station');
const stationProfileRoutes = require('./stationProfile');
const stationScheduleRoutes = require('./stationSchedule');
const clockTemplateRoutes = require('./clockTemplate');
const tagRoutes = require('./tag');
const stationTagPreferenceRoutes = require('./stationTagPreference');
const reportRoutes = require('./reportRoutes');
const onDemandRoutes = require('./onDemandRoutes');

const { generatePlaylistForStation } = require('../generatePlaylist');
const Feedback = require('../models/Feedback');

// station(s)
if (stationRoutes) router.use('/stations', stationRoutes);
if (stationProfileRoutes) router.use('/station-profiles', stationProfileRoutes);
if (stationScheduleRoutes) router.use('/station-schedules', stationScheduleRoutes);

// clock templates
if (clockTemplateRoutes) router.use('/clock-templates', clockTemplateRoutes);

// cart / content
router.use('/content', contentCrudRoutes);
router.use('/carts', cartCrudRoutes);

// advanced tagging
if (tagRoutes) router.use('/tags', tagRoutes);
if (stationTagPreferenceRoutes) {
  router.use('/station-tag-preference', stationTagPreferenceRoutes);
}

// reports
if (reportRoutes) router.use('/reports', reportRoutes);

// onDemand
if (onDemandRoutes) router.use('/on-demand', onDemandRoutes);

// generatePlaylist
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

// feedback
router.post('/feedback', async (req, res) => {
  try {
    const { stationId, contentId, feedbackType } = req.body;
    if (!stationId || !contentId || !feedbackType) {
      return res
        .status(400)
        .json({ error: 'stationId, contentId, and feedbackType are required.' });
    }
    await Feedback.create({ stationId, contentId, feedbackType });
    res.json({ success: true, message: 'Feedback recorded.' });
  } catch (err) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Error recording feedback.' });
  }
});

module.exports = router;
