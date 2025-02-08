// routes/clockMapRoutes.js

const express = require('express');
const router = express.Router();
const { ClockMap, ClockMapSlot } = require('../models');

// GET /api/clock-maps
router.get('/', async (req, res) => {
  try {
    const maps = await ClockMap.findAll();
    res.json(maps);
  } catch (err) {
    console.error('Error fetching clock maps:', err);
    res.status(500).json({ error: 'Server error fetching clock maps.' });
  }
});

// POST /api/clock-maps
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newMap = await ClockMap.create({ name, description });
    res.json(newMap);
  } catch (err) {
    console.error('Error creating clock map:', err);
    res.status(500).json({ error: 'Server error creating clock map.' });
  }
});

// GET /api/clock-maps/:id
router.get('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const map = await ClockMap.findByPk(mapId, {
      include: [ClockMapSlot],
    });
    if (!map) return res.status(404).json({ error: 'Map not found.' });
    res.json(map);
  } catch (err) {
    console.error('Error fetching clock map:', err);
    res.status(500).json({ error: 'Server error fetching clock map.' });
  }
});

// PUT /api/clock-maps/:id
router.put('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { name, description } = req.body;

    const map = await ClockMap.findByPk(mapId);
    if (!map) return res.status(404).json({ error: 'Map not found.' });

    if (name !== undefined) map.name = name;
    if (description !== undefined) map.description = description;
    await map.save();
    res.json(map);
  } catch (err) {
    console.error('Error updating clock map:', err);
    res.status(500).json({ error: 'Server error updating clock map.' });
  }
});

// DELETE /api/clock-maps/:id
router.delete('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const map = await ClockMap.findByPk(mapId);
    if (!map) return res.status(404).json({ error: 'Map not found.' });
    await map.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock map:', err);
    res.status(500).json({ error: 'Server error deleting clock map.' });
  }
});

// PUT /api/clock-maps/:id/slots
// Replaces old day/hour combos not in your new data. Upserts the rest.
router.put('/:id/slots', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { slots } = req.body;

    const map = await ClockMap.findByPk(mapId);
    if (!map) {
      return res.status(404).json({ error: 'Map not found.' });
    }

    // unify
    const finalSlots = [];
    const usedKeys = new Set();

    for (const s of slots) {
      if (s.dayOfWeek == null || s.hour == null) continue;
      const key = `${s.dayOfWeek}-${s.hour}`;
      if (!usedKeys.has(key)) {
        usedKeys.add(key);
        finalSlots.push({
          id: s.id || null,
          dayOfWeek: s.dayOfWeek,
          hour: s.hour,
          clockTemplateId: s.clockTemplateId || null,
        });
      }
    }

    // fetch existing
    const existingSlots = await ClockMapSlot.findAll({
      where: { clockMapId: mapId },
    });
    const existingMap = new Map();
    for (const es of existingSlots) {
      const key = `${es.dayOfWeek}-${es.hour}`;
      existingMap.set(key, es);
    }

    // upsert
    const updatedKeys = new Set();
    for (const f of finalSlots) {
      const key = `${f.dayOfWeek}-${f.hour}`;
      updatedKeys.add(key);

      const existing = existingMap.get(key);
      if (existing) {
        existing.clockTemplateId = f.clockTemplateId;
        await existing.save();
      } else {
        await ClockMapSlot.create({
          clockMapId: mapId,
          dayOfWeek: f.dayOfWeek,
          hour: f.hour,
          clockTemplateId: f.clockTemplateId,
        });
      }
    }

    // remove old
    for (const es of existingSlots) {
      const key = `${es.dayOfWeek}-${es.hour}`;
      if (!updatedKeys.has(key)) {
        await es.destroy();
      }
    }

    // re-fetch
    const updatedMap = await ClockMap.findByPk(mapId, {
      include: [ClockMapSlot],
    });
    res.json({ success: true, clockMap: updatedMap });
  } catch (err) {
    console.error('Error saving clock map slots:', err);
    res.status(500).json({ error: 'Server error saving map slots.' });
  }
});

module.exports = router;
