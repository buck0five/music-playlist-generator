// routes/station.js
const express = require('express');
const router = express.Router();
const { Station } = require('../models');

// GET /api/stations -> list all
router.get('/', async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ error: 'Error fetching stations' });
  }
});

// GET /api/stations/:id
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
  } catch (err) {
    console.error('Error fetching station:', err);
    res.status(500).json({ error: 'Error fetching station' });
  }
});

// POST /api/stations
router.post('/', async (req, res) => {
  try {
    const { name, defaultClockTemplateId, clockMapId, verticalId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Station name is required' });
    }
    const newStation = await Station.create({
      name,
      defaultClockTemplateId: defaultClockTemplateId || null,
      clockMapId: clockMapId || null,
      verticalId: verticalId || null,
    });
    res.json(newStation);
  } catch (err) {
    console.error('Error creating station:', err);
    res.status(500).json({ error: 'Error creating station' });
  }
});

// PUT /api/stations/:id
router.put('/:id', async (req, res) => {
  try {
    const stationId = req.params.id;
    const { name, defaultClockTemplateId, clockMapId, verticalId } = req.body;

    const station = await Station.findByPk(stationId);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    if (name !== undefined) station.name = name;
    if (defaultClockTemplateId !== undefined)
      station.defaultClockTemplateId = defaultClockTemplateId;
    if (clockMapId !== undefined) station.clockMapId = clockMapId;
    if (verticalId !== undefined) station.verticalId = verticalId;

    await station.save();
    res.json(station);
  } catch (err) {
    console.error('Error updating station:', err);
    res.status(500).json({ error: 'Error updating station' });
  }
});

// DELETE /api/stations/:id
router.delete('/:id', async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    await station.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting station:', err);
    res.status(500).json({ error: 'Error deleting station' });
  }
});

module.exports = router;
