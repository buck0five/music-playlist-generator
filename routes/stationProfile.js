// routes/stationProfile.js
const express = require('express');
const router = express.Router();
const { Station, StationProfile } = require('../models');

// GET profile by stationId
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

// CREATE or UPDATE
router.post('/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const { storeHours, contactInfo, dailyTransactionsEstimate } = req.body;

    // Ensure station exists
    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }

    // Find or create
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
    console.error('Error creating/updating profile:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
