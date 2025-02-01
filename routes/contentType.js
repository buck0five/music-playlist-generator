// routes/contentType.js
const express = require('express');
const router = express.Router();
const { ContentType } = require('../models');

// GET all
router.get('/', async (req, res) => {
  try {
    const types = await ContentType.findAll();
    res.json(types);
  } catch (err) {
    console.error('Error fetching content types:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    const newType = await ContentType.create({ name });
    res.json(newType);
  } catch (err) {
    console.error('Error creating content type:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const type = await ContentType.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Not found.' });
    }
    res.json(type);
  } catch (err) {
    console.error('Error fetching content type:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const type = await ContentType.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Not found.' });
    }
    await type.update({ name });
    res.json(type);
  } catch (err) {
    console.error('Error updating content type:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const type = await ContentType.findByPk(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Not found.' });
    }
    await type.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting content type:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
