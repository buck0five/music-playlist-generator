// routes/content.js
const express = require('express');
const router = express.Router();
const { Content } = require('../models');

// GET all content
router.get('/', async (req, res) => {
  try {
    const items = await Content.findAll();
    res.json(items);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// CREATE content
router.post('/', async (req, res) => {
  try {
    const { title, contentType, duration, startDate, endDate } = req.body;
    const newContent = await Content.create({
      title,
      contentType: contentType || 'song',
      duration: duration || 180,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });
    res.json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Server error creating content.' });
  }
});

// GET one content
router.get('/:id', async (req, res) => {
  try {
    const item = await Content.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// UPDATE content (including date range)
router.put('/:id', async (req, res) => {
  try {
    const { startDate, endDate, ...rest } = req.body;
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    if (startDate !== undefined) content.startDate = new Date(startDate);
    if (endDate !== undefined) content.endDate = new Date(endDate);

    // other updates from "rest" if you wish
    if (rest.title !== undefined) content.title = rest.title;
    if (rest.duration !== undefined) content.duration = rest.duration;
    if (rest.contentType !== undefined) content.contentType = rest.contentType;

    await content.save();
    res.json(content);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ error: 'Error updating content.' });
  }
});

// DELETE content
router.delete('/:id', async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    await content.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ error: 'Error deleting content.' });
  }
});

module.exports = router;
