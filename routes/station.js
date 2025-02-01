// routes/station.js

const express = require('express');
const router = express.Router();
const { Station } = require('../models');

// GET all stations (optional, but helpful for testing)
router.get('/', async (req, res) => {
  try {
    const stations = await Station.findAll();
    return res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    return res.status(500).json({ error: 'Server error fetching stations.' });
  }
});

// GET a single station by ID (optional)
router.get('/:id', async (req, res) => {
  try {
    const stationId = req.params.id;
    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    return res.json(station);
  } catch (error) {
    console.error('Error fetching station:', error);
    return res.status(500).json({ error: 'Server error fetching station.' });
  }
});

// CREATE a new station (optional)
router.post('/', async (req, res) => {
  try {
    const { name, defaultClockTemplateId } = req.body;
    // 'name' is required, you can decide if 'defaultClockTemplateId' is required
    if (!name) {
      return res.status(400).json({ error: 'Station name is required.' });
    }

    const newStation = await Station.create({
      name,
      defaultClockTemplateId: defaultClockTemplateId || null,
    });
    return res.json(newStation);
  } catch (error) {
    console.error('Error creating station:', error);
    return res.status(500).json({ error: 'Server error creating station.' });
  }
});

// UPDATE a station's defaultClockTemplateId (or name)
router.put('/:id', async (req, res) => {
  try {
    const stationId = req.params.id;
    const { name, defaultClockTemplateId } = req.body;

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }

    // Only update the fields we sent in
    if (typeof name !== 'undefined') {
      station.name = name;
    }
    if (typeof defaultClockTemplateId !== 'undefined') {
      station.defaultClockTemplateId = defaultClockTemplateId;
    }

    await station.save();
    return res.json(station);
  } catch (error) {
    console.error('Error updating station:', error);
    return res.status(500).json({ error: 'Server error updating station.' });
  }
});

// DELETE a station (optional)
router.delete('/:id', async (req, res) => {
  try {
    const stationId = req.params.id;
    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    await station.destroy();
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting station:', error);
    return res.status(500).json({ error: 'Server error deleting station.' });
  }
});

module.exports = router;
