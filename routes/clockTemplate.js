// routes/clockTemplate.js

const express = require('express');
const router = express.Router();
const { ClockTemplate, ClockTemplateSlot } = require('../models');

// GET /api/clock-templates
// Lists all clock templates
router.get('/', async (req, res) => {
  try {
    const templates = await ClockTemplate.findAll();
    res.json(templates);
  } catch (err) {
    console.error('Error fetching clock templates:', err);
    res.status(500).json({ error: 'Server error fetching clock templates.' });
  }
});

// POST /api/clock-templates
// Create a new clock template
router.post('/', async (req, res) => {
  try {
    const { templateName, description } = req.body;
    const newCT = await ClockTemplate.create({ templateName, description });
    res.json(newCT);
  } catch (err) {
    console.error('Error creating clock template:', err);
    res.status(500).json({ error: 'Server error creating clock template.' });
  }
});

// GET /api/clock-templates/:id
// Fetch one clock template and its slots
router.get('/:id', async (req, res) => {
  try {
    const ctId = req.params.id;
    const clockTemplate = await ClockTemplate.findByPk(ctId, {
      include: [
        {
          model: ClockTemplateSlot,
          as: 'slots',
        },
      ],
    });
    if (!clockTemplate) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    // Optionally sort slots by minuteOffset
    if (clockTemplate.slots && clockTemplate.slots.length) {
      clockTemplate.slots.sort((a, b) => a.minuteOffset - b.minuteOffset);
    }
    res.json(clockTemplate);
  } catch (err) {
    console.error('Error fetching clock template:', err);
    res.status(500).json({ error: 'Server error fetching clock template.' });
  }
});

// PUT /api/clock-templates/:id
// Update templateName or description
router.put('/:id', async (req, res) => {
  try {
    const ctId = req.params.id;
    const { templateName, description } = req.body;
    const ct = await ClockTemplate.findByPk(ctId);
    if (!ct) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    if (templateName !== undefined) ct.templateName = templateName;
    if (description !== undefined) ct.description = description;
    await ct.save();
    res.json(ct);
  } catch (err) {
    console.error('Error updating clock template:', err);
    res.status(500).json({ error: 'Server error updating clock template.' });
  }
});

// NEW: PUT /api/clock-templates/:id/slots
// Save slot reorder or updates (minuteOffset, slotType, cartId, etc.)
router.put('/:id/slots', async (req, res) => {
  try {
    const ctId = req.params.id;
    const { slots } = req.body; // an array of updated slot objects
    if (!slots || !Array.isArray(slots)) {
      return res
        .status(400)
        .json({ error: 'slots must be an array of updated slot objects.' });
    }

    // Verify the clock template exists
    const ct = await ClockTemplate.findByPk(ctId);
    if (!ct) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }

    // For each slot, update the existing record
    for (const updated of slots) {
      if (!updated.id) continue; // skip if no id
      const slotRecord = await ClockTemplateSlot.findByPk(updated.id);
      if (!slotRecord) continue; // skip if slot doesn't exist

      if (updated.minuteOffset !== undefined) {
        slotRecord.minuteOffset = updated.minuteOffset;
      }
      if (updated.slotType !== undefined) {
        slotRecord.slotType = updated.slotType;
      }
      // If a slot is type "cart", we store updated.cartId
      // If it's "song", cartId can be null
      if (updated.cartId !== undefined) {
        slotRecord.cartId = updated.cartId;
      }
      await slotRecord.save();
    }

    // Re-fetch the updated template with slots
    const updatedCT = await ClockTemplate.findByPk(ctId, {
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    });
    // Optionally sort
    if (updatedCT.slots && updatedCT.slots.length) {
      updatedCT.slots.sort((a, b) => a.minuteOffset - b.minuteOffset);
    }

    res.json({
      success: true,
      message: 'Slots updated successfully',
      clockTemplate: updatedCT,
    });
  } catch (err) {
    console.error('Error saving clock template slots:', err);
    res
      .status(500)
      .json({ error: 'Server error saving clock template slot updates.' });
  }
});

// DELETE /api/clock-templates/:id
router.delete('/:id', async (req, res) => {
  try {
    const ctId = req.params.id;
    const ct = await ClockTemplate.findByPk(ctId);
    if (!ct) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    await ct.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock template:', err);
    res.status(500).json({ error: 'Server error deleting clock template.' });
  }
});

module.exports = router;
