// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { PlaybackLog, Station, Content } = require('../models');

// GET /api/reports/playback -> retrieve playback logs
router.get('/playback', async (req, res) => {
  try {
    const stationId = req.query.stationId || null;
    const whereClause = {};
    if (stationId) {
      whereClause.stationId = stationId;
    }
    const logs = await PlaybackLog.findAll({
      where: whereClause,
      include: [
        { model: Station },
        { model: Content },
      ],
      order: [['playedAt', 'DESC']],
    });
    res.json(logs);
  } catch (err) {
    console.error('Error fetching playback logs:', err);
    res.status(500).json({ error: 'Server error fetching playback logs.' });
  }
});

module.exports = router;
