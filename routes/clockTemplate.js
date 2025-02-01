// routes/clockTemplate.js
const express = require('express');
const router = express.Router();
const { ClockTemplate, ClockTemplateSlot } = require('../models');

// GET all clock templates
router.get('/', async (req, res) => {
  try {
    const templates = await ClockTemplate.findAll({
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    });
    res.json(templates);
  } catch (err) {
    console.error('Error fetching clock templates:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE a new clock template
router.post('/', async (req, res) => {
  try {
    const { templateName, description, slots } = req.body;
    const newTemplate = await ClockTemplate.create({ templateName, description });

    // If "slots" array is passed, create slot records
    // slots: [ { minuteOffset: 0, slotType: 'song' }, { minuteOffset: 15, slotType: 'cart' }, ... ]
    if (Array.isArray(slots)) {
      for (const slotData of slots) {
        await ClockTemplateSlot.create({
          clockTemplateId: newTemplate.id,
          minuteOffset: slotData.minuteOffset || 0,
          slotType: slotData.slotType || 'song',
        });
      }
    }

    const result = await ClockTemplate.findByPk(newTemplate.id, {
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    });
    res.json(result);
  } catch (err) {
    console.error('Error creating clock template:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET single template by ID (with slots)
router.get('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id, {
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    });
    if (!template) {
      return res.status(404).json({ error: 'Not found.' });
    }
    res.json(template);
  } catch (err) {
    console.error('Error fetching clock template:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE template name/desc
router.put('/:id', async (req, res) => {
  try {
    const { templateName, description } = req.body;
    const template = await ClockTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Not found.' });
    }
    await template.update({ templateName, description });
    res.json(template);
  } catch (err) {
    console.error('Error updating clock template:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE template (and cascade slots)
router.delete('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Not found.' });
    }
    // Deleting the template will also delete slots if you set 'onDelete: cascade' in your associations
    await template.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock template:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
