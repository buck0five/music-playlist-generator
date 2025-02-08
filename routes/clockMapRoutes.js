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
    if (!map) {
      return res.status(404).json({ error: 'Map not found.' });
    }
    res.json(map);
  } catch (err) {
    console.error('Error fetching clock map:', err);
    res.status(500).json({ error: 'Server error fetching clock map.' });
  }
});

// PUT /api/clock-maps/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const mapId = req.params.id;
    const map = await ClockMap.findByPk(mapId);
    if (!map) {
      return res.status(404).json({ error: 'Map not found.' });
    }
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
    if (!map) {
      return res.status(404).json({ error: 'Map not found.' });
    }
    await map.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock map:', err);
    res.status(500).json({ error: 'Server error deleting clock map.' });
  }
});

// PUT /api/clock-maps/:id/slots
router.put('/:id/slots', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { slots } = req.body; // array of { id, dayOfWeek, hour, clockTemplateId }

    const map = await ClockMap.findByPk(mapId);
    if (!map) {
      return res.status(404).json({ error: 'Map not found.' });
    }

    // Upsert each slot
    for (const s of slots) {
      if (s.id) {
        // Update existing
        const slotRec = await ClockMapSlot.findByPk(s.id);
        if (!slotRec) continue;
        slotRec.dayOfWeek = s.dayOfWeek;
        slotRec.hour = s.hour;
        slotRec.clockTemplateId = s.clockTemplateId || null;
        await slotRec.save();
      } else {
        // Create new
        await ClockMapSlot.create({
          clockMapId: map.id,
          dayOfWeek: s.dayOfWeek,
          hour: s.hour,
          clockTemplateId: s.clockTemplateId || null,
        });
      }
    }

    // Re-fetch the updated map with slots
    const updatedMap = await ClockMap.findByPk(mapId, {
      include: [ClockMapSlot],
    });
    res.json({
      success: true,
      clockMap: updatedMap,
    });
  } catch (err) {
    console.error('Error saving clock map slots:', err);
    res.status(500).json({ error: 'Server error saving slots.' });
  }
});

module.exports = router;
