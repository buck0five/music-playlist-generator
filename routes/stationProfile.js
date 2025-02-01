// routes/stationProfile.js
const express = require('express');
const router = express.Router();
const { Station, StationProfile } = require('../models');

router.get('/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const profile = await StationProfile.findOne({ where: { stationId } });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json(profile);
  } catch (err) {
    console.error('Error fetching station profile:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE or UPDATE station profile
router.post('/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const { storeHours, contactInfo, dailyTransactionsEstimate } = req.body;

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }

    let profile = await StationProfile.findOne({ where: { stationId } });
    if (!profile) {
      profile = await StationProfile.create({
        stationId,
        storeHours,
        contactInfo,
        dailyTransactionsEstimate,
      });
    } else {
      await profile.update({ storeHours, contactInfo, dailyTransactionsEstimate });
    }

    res.json(profile);
  } catch (err) {
    console.error('Error creating/updating station profile:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
