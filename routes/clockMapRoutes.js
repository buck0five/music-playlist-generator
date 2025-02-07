// routes/clockMapRoutes.js

const express = require('express');
const router = express.Router();
const { ClockMap, ClockMapSlot, ClockTemplate } = require('../models');

// GET /api/clock-maps -> list all
router.get('/', async (req, res) => {
  try {
    const maps = await ClockMap.findAll();
    res.json(maps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching clock maps.' });
  }
});

// POST /api/clock-maps -> create new clock map
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newMap = await ClockMap.create({ name, description });
    res.json(newMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating clock map.' });
  }
});

// GET /api/clock-maps/:id -> fetch one map + slots
router.get('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const map = await ClockMap.findByPk(mapId, {
      include: [ClockMapSlot],
    });
    if (!map) return res.status(404).json({ error: 'Map not found' });
    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching map.' });
  }
});

// PUT /api/clock-maps/:id -> update name/desc
router.put('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { name, description } = req.body;
    const map = await ClockMap.findByPk(mapId);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    if (name !== undefined) map.name = name;
    if (description !== undefined) map.description = description;
    await map.save();
    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating map.' });
  }
});

// DELETE /api/clock-maps/:id
router.delete('/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const map = await ClockMap.findByPk(mapId);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    await map.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting map.' });
  }
});

// PUT /api/clock-maps/:id/slots -> save day/hour -> clockTemplateId mappings
router.put('/:id/slots', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { slots } = req.body; // array of { id, dayOfWeek, hour, clockTemplateId }

    const map = await ClockMap.findByPk(mapId);
    if (!map) return res.status(404).json({ error: 'Map not found' });

    // update or create each
    for (const s of slots) {
      if (s.id) {
        // existing record
        const slotRec = await ClockMapSlot.findByPk(s.id);
        if (!slotRec) continue;
        slotRec.dayOfWeek = s.dayOfWeek;
        slotRec.hour = s.hour;
        slotRec.clockTemplateId = s.clockTemplateId;
        await slotRec.save();
      } else {
        // new record
        await ClockMapSlot.create({
          clockMapId: mapId,
          dayOfWeek: s.dayOfWeek,
          hour: s.hour,
          clockTemplateId: s.clockTemplateId,
        });
      }
    }
    // optional cleanup if you want to remove missing slots

    // re-fetch
    const updatedMap = await ClockMap.findByPk(mapId, {
      include: [ClockMapSlot],
    });
    res.json({
      success: true,
      clockMap: updatedMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error saving slot mappings.' });
  }
});

module.exports = router;
