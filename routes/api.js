// routes/api.js

const express = require('express');
const router = express.Router();

// ---------------- IMPORT SUB-ROUTES ----------------
// These come from your repo. Adjust or remove if certain files don't exist.

const stationRoutes = require('./station');              // if you have station.js
const stationProfileRoutes = require('./stationProfile'); // if stationProfile.js
const stationScheduleRoutes = require('./stationSchedule'); // if stationSchedule.js
const clockTemplateRoutes = require('./clockTemplate');   // if clockTemplate.js

// Cart & Content routes
const cartCrudRoutes = require('./cartCrudRoutes');       // cart editor
const contentCrudRoutes = require('./contentCrudRoutes'); // content CRUD

// Tagging or advanced preference
const tagRoutes = require('./tag');                       // if tag.js
const stationTagPreferenceRoutes = require('./stationTagPreference'); // if stationTagPreference.js

// Reports 
const reportRoutes = require('./reportRoutes');           // if reportRoutes.js

// On-demand
const onDemandRoutes = require('./onDemandRoutes');       // newly added for on-demand generation

// ---------------- OTHER IMPORTS (FROM YOUR REPO) ----------------
const { generatePlaylistForStation } = require('../generatePlaylist');
const Feedback = require('../models/Feedback');
const StationExcludedContent = require('../models/StationExcludedContent'); 
// if you reference it

// ---------------- MOUNT THE SUB-ROUTES ----------------

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

// ---------------- EXAMPLE PLAYLIST / FEEDBACK ENDPOINTS ----------------

// Example generatePlaylist endpoint (if you still need it separate from on-demand)
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

// Simple feedback route
router.post('/feedback', async (req, res) => {
  try {
    const { stationId, contentId, feedbackType } = req.body;
    if (!stationId || !contentId || !feedbackType) {
      return res.status(400).json({
        error: 'stationId, contentId, and feedbackType are required.',
      });
    }
    // record in Feedback table
    await Feedback.create({ stationId, contentId, feedbackType });
    res.json({ success: true, message: 'Feedback recorded.' });
  } catch (err) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Error recording feedback.' });
  }
});

// ---------------- EXPORT ----------------
module.exports = router;
