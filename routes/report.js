// routes/report.js
const express = require('express');
const router = express.Router();
const { PlaybackLog, Content, Station } = require('../models');
const { Op } = require('sequelize');

// GET /api/report/playback-logs?stationId=1&startDate=2025-01-01&endDate=2025-01-31
router.get('/playback-logs', async (req, res) => {
  try {
    const { stationId, startDate, endDate, contentType } = req.query;

    // Build a "where" object
    const where = {};
    if (stationId) {
      where.stationId = stationId;
    }
    if (startDate || endDate) {
      where.playedAt = {};
      if (startDate) {
        where.playedAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.playedAt[Op.lte] = new Date(endDate);
      }
    }

    // We'll fetch PlaybackLogs joined with Content so we can filter by contentType
    const include = [
      { model: Content, as: 'content' }, 
      { model: Station, as: 'station' },
    ];

    // We'll do a two-step approach if contentType is specified
    // (One-step approach is also possible, but let's keep it simple)
    let logs = await PlaybackLog.findAll({
      where,
      include,
      order: [['playedAt', 'DESC']],
    });

    if (contentType) {
      // filter logs in-memory, or do a nested "where" with an include
      logs = logs.filter(log => log.content.contentType === contentType);
    }

    res.json(logs);
  } catch (err) {
    console.error('Error fetching playback logs:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
