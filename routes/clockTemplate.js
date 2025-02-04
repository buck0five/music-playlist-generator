// routes/clockTemplate.js
const express = require('express');
const router = express.Router();
const { ClockTemplate, ClockTemplateSlot } = require('../models');

// GET /api/clock-templates
router.get('/', async (req, res) => {
  try {
    // Eager load with the alias "slots" from our updated association
    const templates = await ClockTemplate.findAll({
      include: [
        {
          model: ClockTemplateSlot,
          as: 'slots', // must match the 'as' in models/index.js
        },
      ],
    });
    res.json(templates);
  } catch (err) {
    console.error('Error fetching clock templates:', err);
    res.status(500).json({ error: 'Server error fetching clock templates.' });
  }
});

// POST /api/clock-templates
router.post('/', async (req, res) => {
  try {
    const { templateName, description } = req.body;
    const newTemplate = await ClockTemplate.create({ templateName, description });
    res.json(newTemplate);
  } catch (err) {
    console.error('Error creating clock template:', err);
    res.status(500).json({ error: 'Server error creating clock template.' });
  }
});

// GET /api/clock-templates/:id
router.get('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id, {
      include: [
        {
          model: ClockTemplateSlot,
          as: 'slots',
        },
      ],
    });
    if (!template) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    res.json(template);
  } catch (err) {
    console.error('Error fetching clock template:', err);
    res.status(500).json({ error: 'Server error fetching clock template.' });
  }
});

// PUT /api/clock-templates/:id
router.put('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    const { templateName, description } = req.body;
    if (templateName !== undefined) template.templateName = templateName;
    if (description !== undefined) template.description = description;

    await template.save();
    res.json(template);
  } catch (err) {
    console.error('Error updating clock template:', err);
    res.status(500).json({ error: 'Server error updating clock template.' });
  }
});

// DELETE /api/clock-templates/:id
router.delete('/:id', async (req, res) => {
  try {
    const template = await ClockTemplate.findByPk(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Clock template not found.' });
    }
    await template.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting clock template:', err);
    res.status(500).json({ error: 'Server error deleting clock template.' });
  }
});

module.exports = router;
