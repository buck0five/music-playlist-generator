// routes/station.js
const express = require('express');
const router = express.Router();
const { Station } = require('../models');

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

// GET one station
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found.' });
    }
    res.json(station);
  } catch (err) {
    console.error('Error fetching station:', err);
    res.status(500).json({ error: 'Server error fetching station.' });
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
    res.status(500).json({ error: 'Server error creating station.' });
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
    if (defaultClockTemplateId !== undefined) {
      station.defaultClockTemplateId = defaultClockTemplateId;
    }
    await station.save();
    res.json(station);
  } catch (err) {
    console.error('Error updating station:', err);
    res.status(500).json({ error: 'Server error updating station.' });
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
    res.status(500).json({ error: 'Server error deleting station.' });
  }
});

module.exports = router;
