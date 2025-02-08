// routes/verticalRoutes.js

const express = require('express');
const router = express.Router();
const { Vertical, Station, ContentLibrary } = require('../models');

// GET /api/verticals -> list all
router.get('/', async (req, res) => {
  try {
    const verts = await Vertical.findAll();
    res.json(verts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching verticals' });
  }
});

// POST /api/verticals -> create new
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const newVert = await Vertical.create({ name, description });
    res.json(newVert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating vertical' });
  }
});

// GET /api/verticals/:id -> one vertical + stations or content libraries
router.get('/:id', async (req, res) => {
  try {
    const vertId = req.params.id;
    const vert = await Vertical.findByPk(vertId, {
      include: [Station, ContentLibrary],
    });
    if (!vert) return res.status(404).json({ error: 'Vertical not found' });
    res.json(vert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching vertical' });
  }
});

// PUT /api/verticals/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const vertId = req.params.id;
    const vert = await Vertical.findByPk(vertId);
    if (!vert) return res.status(404).json({ error: 'Vertical not found' });

    if (name !== undefined) vert.name = name;
    if (description !== undefined) vert.description = description;
    await vert.save();
    res.json(vert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating vertical' });
  }
});

// DELETE /api/verticals/:id
router.delete('/:id', async (req, res) => {
  try {
    const vertId = req.params.id;
    const vert = await Vertical.findByPk(vertId);
    if (!vert) return res.status(404).json({ error: 'Vertical not found' });
    await vert.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting vertical' });
  }
});

module.exports = router;
