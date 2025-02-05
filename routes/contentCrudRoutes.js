// routes/contentCrudRoutes.js

const express = require('express');
const router = express.Router();
const { Content } = require('../models');

// GET /api/content
router.get('/', async (req, res) => {
  try {
    const allContent = await Content.findAll();
    res.json(allContent);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error fetching content.' });
  }
});

// POST /api/content
router.post('/', async (req, res) => {
  try {
    const {
      title,
      contentType,
      formatId,
      duration,
      score,
      fileName,
      startDate,
      endDate,
      dailyStartHour,
      dailyEndHour,
      visibility,
    } = req.body;

    if (!title || !contentType) {
      return res.status(400).json({ error: 'title and contentType are required.' });
    }

    const newContent = await Content.create({
      title,
      contentType,
      formatId,
      duration,
      score,
      fileName,
      startDate,
      endDate,
      dailyStartHour,
      dailyEndHour,
      visibility,
    });
    res.json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Server error creating content.' });
  }
});

// GET /api/content/:id
router.get('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const item = await Content.findByPk(contentId);
    if (!item) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching content item:', err);
    res.status(500).json({ error: 'Server error fetching content.' });
  }
});

// PUT /api/content/:id
router.put('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const item = await Content.findByPk(contentId);
    if (!item) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    const {
      title,
      contentType,
      formatId,
      duration,
      score,
      fileName,
      startDate,
      endDate,
      dailyStartHour,
      dailyEndHour,
      visibility,
    } = req.body;

    if (title !== undefined) item.title = title;
    if (contentType !== undefined) item.contentType = contentType;
    if (formatId !== undefined) item.formatId = formatId;
    if (duration !== undefined) item.duration = duration;
    if (score !== undefined) item.score = score;
    if (fileName !== undefined) item.fileName = fileName;
    if (startDate !== undefined) item.startDate = startDate;
    if (endDate !== undefined) item.endDate = endDate;
    if (dailyStartHour !== undefined) item.dailyStartHour = dailyStartHour;
    if (dailyEndHour !== undefined) item.dailyEndHour = dailyEndHour;
    if (visibility !== undefined) item.visibility = visibility;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ error: 'Server error updating content.' });
  }
});

// DELETE /api/content/:id
router.delete('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const item = await Content.findByPk(contentId);
    if (!item) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ error: 'Server error deleting content.' });
  }
});

module.exports = router;
