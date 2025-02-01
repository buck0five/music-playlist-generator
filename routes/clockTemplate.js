// routes/clockTemplate.js
const express = require('express');
const router = express.Router();
const { ClockTemplate, ClockTemplateSlot } = require('../models');

// GET all templates
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

// CREATE a new template
router.post('/', async (req, res) => {
  try {
    const { templateName, description, slots } = req.body;
    const newTemplate = await ClockTemplate.create({ templateName, description });
    // If slots array is provided
    if (Array.isArray(slots)) {
      for (const s of slots) {
        await ClockTemplateSlot.create({
          clockTemplateId: newTemplate.id,
          minuteOffset: s.minuteOffset || 0,
          slotType: s.slotType || 'song',
          cartId: s.cartId || null,
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

// GET single template
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

// UPDATE template
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

// DELETE template
router.delete('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Not found.' });
    }
    await template.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock template:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
