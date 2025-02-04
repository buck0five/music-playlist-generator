// routes/api.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Import sub-routes
const stationRoutes = require('./station');
const stationProfileRoutes = require('./stationProfile');
const stationScheduleRoutes = require('./stationSchedule');
const clockTemplateRoutes = require('./clockTemplate');
const cartRoutes = require('./cart');
const contentTypeRoutes = require('./contentType');

// Import models & logic
const { Feedback, StationExcludedContent, PlaybackLog, Content, Station } = require('../models');
const { generatePlaylistForStation } = require('../generatePlaylist');
const { Op } = require('sequelize');

// import the clockTemplateSlot router
const clockTemplateSlotRoutes = require('./clockTemplateSlot');

// --------------- MOUNT SUB-ROUTES ----------------
router.use('/stations', stationRoutes);
router.use('/station-profiles', stationProfileRoutes);
router.use('/station-schedules', stationScheduleRoutes);
router.use('/clock-templates', clockTemplateRoutes);
router.use('/carts', cartRoutes);
router.use('/content-types', contentTypeRoutes);

// Clock Template Slot routes
router.use('/clock-template-slots', clockTemplateSlotRoutes);

// --------------- PLAYLIST GENERATION --------------
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

// --------------- FEEDBACK ROUTE -------------------
router.post('/feedback', async (req, res) => {
  try {
    // e.g. { "stationId":1, "contentId":7, "feedbackType":"like"|"dislike" }
    const { stationId, contentId, feedbackType } = req.body;
    if (!stationId || !contentId || !feedbackType) {
      return res.status(400).json({ error: 'Missing stationId, contentId, or feedbackType.' });
    }

    // Create the Feedback record
    await Feedback.create({ contentId, feedbackType });

    // If dislike => exclude from station
    if (feedbackType === 'dislike') {
      await StationExcludedContent.findOrCreate({
        where: { stationId, contentId },
      });
    }

    res.json({ success: true, message: 'Feedback recorded. Content excluded if disliked.' });
  } catch (err) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Error recording feedback.' });
  }
});

// --------------- OPTIONAL LIVE-PLAYLIST ROUTE -------------
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

// --------------- PLAYBACK LOGS REPORT --------------
/** 
 * GET /api/playback-logs?stationId=1&startDate=2025-01-01&endDate=2025-01-31&contentType=ad
 */
router.get('/playback-logs', async (req, res) => {
  try {
    const { stationId, startDate, endDate, contentType } = req.query;
    
    // Build "where" for PlaybackLog
    const where = {};
    if (stationId) where.stationId = stationId;
    if (startDate || endDate) {
      where.playedAt = {};
      if (startDate) {
        where.playedAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.playedAt[Op.lte] = new Date(endDate);
      }
    }

    // We'll include 'content' so we can filter by contentType
    const logs = await PlaybackLog.findAll({
      where,
      include: [
        { model: Station, as: 'station' },
        { model: Content, as: 'content' },
      ],
      order: [['playedAt', 'DESC']],
    });

    // If contentType is specified, filter in memory
    let filtered = logs;
    if (contentType) {
      filtered = logs.filter(log => log.content.contentType === contentType);
    }

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching playback logs:', err);
    res.status(500).json({ error: 'Server error fetching playback logs.' });
  }
});

module.exports = router;
