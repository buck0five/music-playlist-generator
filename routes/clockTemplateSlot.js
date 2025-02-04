// routes/clockTemplateSlot.js
const express = require('express');
const router = express.Router();
const { ClockTemplateSlot } = require('../models');

// GET /api/clock-template-slots?clockTemplateId=3
router.get('/', async (req, res) => {
  try {
    const { clockTemplateId } = req.query;
    const whereClause = {};

    if (clockTemplateId) {
      whereClause.clockTemplateId = clockTemplateId;
    }

    const slots = await ClockTemplateSlot.findAll({ where: whereClause });
    res.json(slots);
  } catch (err) {
    console.error('Error fetching clock template slots:', err);
    res.status(500).json({ error: 'Server error fetching slots.' });
  }
});

// POST /api/clock-template-slots
router.post('/', async (req, res) => {
  try {
    const { clockTemplateId, slotType, minuteOffset, cartId } = req.body;

    const newSlot = await ClockTemplateSlot.create({
      clockTemplateId,
      slotType,
      minuteOffset,
      cartId,
    });
    res.json(newSlot);
  } catch (err) {
    console.error('Error creating slot:', err);
    res.status(500).json({ error: 'Server error creating slot.' });
  }
});

// GET /api/clock-template-slots/:id
router.get('/:id', async (req, res) => {
  try {
    const slot = await ClockTemplateSlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }
    res.json(slot);
  } catch (err) {
    console.error('Error fetching slot:', err);
    res.status(500).json({ error: 'Server error fetching slot.' });
  }
});

// PUT /api/clock-template-slots/:id
router.put('/:id', async (req, res) => {
  try {
    const slot = await ClockTemplateSlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }
    const { clockTemplateId, slotType, minuteOffset, cartId } = req.body;
    if (clockTemplateId !== undefined) slot.clockTemplateId = clockTemplateId;
    if (slotType !== undefined) slot.slotType = slotType;
    if (minuteOffset !== undefined) slot.minuteOffset = minuteOffset;
    if (cartId !== undefined) slot.cartId = cartId;

    await slot.save();
    res.json(slot);
  } catch (err) {
    console.error('Error updating slot:', err);
    res.status(500).json({ error: 'Server error updating slot.' });
  }
});

// DELETE /api/clock-template-slots/:id
router.delete('/:id', async (req, res) => {
  try {
    const slot = await ClockTemplateSlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found.' });
    }
    await slot.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting slot:', err);
    res.status(500).json({ error: 'Server error deleting slot.' });
  }
});

module.exports = router;
