// routes/station.js
const express = require('express');
const router = express.Router();
const { Station, StationProfile, StationExcludedContent } = require('../models');

// GET all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ error: 'Server error fetching stations.' });
  }
});

// GET one station by ID
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    res.json(station);
  } catch (err) {
    console.error('Error fetching station:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE station
router.post('/', async (req, res) => {
  try {
    const { name, defaultClockTemplateId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Station name is required.' });
    }
    const newStation = await Station.create({
      name,
      defaultClockTemplateId: defaultClockTemplateId || null,
    });
    res.json(newStation);
  } catch (err) {
    console.error('Error creating station:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE station
router.put('/:id', async (req, res) => {
  try {
    const { name, defaultClockTemplateId } = req.body;
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    if (name !== undefined) station.name = name;
    if (defaultClockTemplateId !== undefined) station.defaultClockTemplateId = defaultClockTemplateId;
    await station.save();
    res.json(station);
  } catch (err) {
    console.error('Error updating station:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE station
router.delete('/:id', async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    await station.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting station:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// EXCLUDE content for this station
router.post('/:stationId/exclude-content', async (req, res) => {
  try {
    const { stationId } = req.params;
    const { contentId } = req.body;
    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required.' });
    }

    // Check if station exists
    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }

    // Exclude content
    await StationExcludedContent.findOrCreate({
      where: { stationId, contentId },
    });

    res.json({ success: true, stationId, contentId });
  } catch (err) {
    console.error('Error excluding content:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UNEXCLUDE content for this station
router.delete('/:stationId/exclude-content/:contentId', async (req, res) => {
  try {
    const stationId = parseInt(req.params.stationId, 10);
    const contentId = parseInt(req.params.contentId, 10);

    const record = await StationExcludedContent.findOne({
      where: { stationId, contentId },
    });
    if (!record) {
      return res.status(404).json({ error: 'Not currently excluded or not found.' });
    }
    await record.destroy();

    res.json({ success: true, stationId, contentId });
  } catch (err) {
    console.error('Error unexcluding content:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
