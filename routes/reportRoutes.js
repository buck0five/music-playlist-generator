// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { PlaybackLog, Station, Content } = require('../models');

router.get('/playback', async (req, res) => {
  try {
    const stationId = req.query.stationId;
    const whereClause = {};
    if (stationId) whereClause.stationId = stationId;

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
    console.error(err);
    res.status(500).json({ error: 'Error fetching playback logs.' });
  }
});

module.exports = router;
