// routes/stationSchedule.js
const express = require('express');
const router = express.Router();
const { StationSchedule } = require('../models');

// GET all schedules, optionally filter by stationId
router.get('/', async (req, res) => {
  try {
    const stationId = req.query.stationId;
    const where = {};
    if (stationId) where.stationId = stationId;

    const schedules = await StationSchedule.findAll({ where });
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching station schedules:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE schedule
// Body example: { stationId, clockTemplateId, startHour, endHour }
router.post('/', async (req, res) => {
  try {
    const { stationId, clockTemplateId, startHour, endHour } = req.body;
    if (!stationId || !clockTemplateId) {
      return res.status(400).json({ error: 'stationId and clockTemplateId are required.' });
    }
    const newSched = await StationSchedule.create({
      stationId,
      clockTemplateId,
      startHour: startHour ?? 0,
      endHour: endHour ?? 23,
    });
    res.json(newSched);
  } catch (err) {
    console.error('Error creating station schedule:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE schedule
router.put('/:id', async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { stationId, clockTemplateId, startHour, endHour } = req.body;

    const sched = await StationSchedule.findByPk(scheduleId);
    if (!sched) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    if (stationId !== undefined) sched.stationId = stationId;
    if (clockTemplateId !== undefined) sched.clockTemplateId = clockTemplateId;
    if (startHour !== undefined) sched.startHour = startHour;
    if (endHour !== undefined) sched.endHour = endHour;

    await sched.save();
    res.json(sched);
  } catch (err) {
    console.error('Error updating station schedule:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE schedule
router.delete('/:id', async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const sched = await StationSchedule.findByPk(scheduleId);
    if (!sched) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }
    await sched.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting station schedule:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
