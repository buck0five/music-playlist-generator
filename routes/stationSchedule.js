// routes/stationSchedule.js
const express = require('express');
const router = express.Router();
const { StationSchedule } = require('../models');
const { Op } = require('sequelize');

// GET /api/station-schedules
router.get('/', async (req, res) => {
  try {
    const { stationId } = req.query;
    const whereClause = {};
    if (stationId) {
      whereClause.stationId = stationId;
    }
    const schedules = await StationSchedule.findAll({ where: whereClause });
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching station schedules:', err);
    res.status(500).json({ error: 'Server error fetching station schedules.' });
  }
});

// POST /api/station-schedules
router.post('/', async (req, res) => {
  try {
    const { stationId, clockTemplateId, dayOfWeek, startHour, endHour } = req.body;
    const newSchedule = await StationSchedule.create({
      stationId,
      clockTemplateId,
      dayOfWeek,
      startHour,
      endHour,
    });
    res.json(newSchedule);
  } catch (err) {
    console.error('Error creating station schedule:', err);
    res.status(500).json({ error: 'Server error creating station schedule.' });
  }
});

// GET /api/station-schedules/:id
router.get('/:id', async (req, res) => {
  try {
    const schedule = await StationSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    res.json(schedule);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ error: 'Server error fetching schedule.' });
  }
});

// PUT /api/station-schedules/:id
router.put('/:id', async (req, res) => {
  try {
    const schedule = await StationSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    const { stationId, clockTemplateId, dayOfWeek, startHour, endHour } = req.body;
    if (stationId !== undefined) schedule.stationId = stationId;
    if (clockTemplateId !== undefined) schedule.clockTemplateId = clockTemplateId;
    if (dayOfWeek !== undefined) schedule.dayOfWeek = dayOfWeek;
    if (startHour !== undefined) schedule.startHour = startHour;
    if (endHour !== undefined) schedule.endHour = endHour;

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ error: 'Server error updating schedule.' });
  }
});

// DELETE /api/station-schedules/:id
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await StationSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    await schedule.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ error: 'Server error deleting schedule.' });
  }
});

module.exports = router;
