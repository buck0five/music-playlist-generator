// routes/contentCrud.js
const express = require('express');
const router = express.Router();
const { Content } = require('../models');

/**
 * GET /api/content
 * Returns all content items. You could filter by contentType if you want.
 */
router.get('/', async (req, res) => {
  try {
    const contents = await Content.findAll(); 
    res.json(contents);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error fetching content.' });
  }
});

/**
 * POST /api/content
 * Creates a new content item. 
 * Body might include: { title, contentType, formatId, duration, fileName, etc. }
 */
router.post('/', async (req, res) => {
  try {
    const {
      title,
      contentType, 
      formatId,
      duration,
      score,
      fileName,
    } = req.body;

    // Adjust fields as needed
    const newContent = await Content.create({
      title,
      contentType,
      formatId,
      duration,
      score,
      fileName,
    });

    res.json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).json({ error: 'Server error creating content.' });
  }
});

/**
 * GET /api/content/:id
 * Fetch one content item by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error fetching content.' });
  }
});

/**
 * PUT /api/content/:id
 * Update an existing content item
 */
router.put('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    // Fields you allow updates to
    const {
      title,
      contentType,
      formatId,
      duration,
      score,
      fileName,
    } = req.body;

    if (title !== undefined) content.title = title;
    if (contentType !== undefined) content.contentType = contentType;
    if (formatId !== undefined) content.formatId = formatId;
    if (duration !== undefined) content.duration = duration;
    if (score !== undefined) content.score = score;
    if (fileName !== undefined) content.fileName = fileName;

    await content.save();
    res.json(content);
  } catch (err) {
    console.error('Error updating content:', err);
    res.status(500).json({ error: 'Server error updating content.' });
  }
});

/**
 * DELETE /api/content/:id
 * Remove a content item if desired
 */
router.delete('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    await content.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting content:', err);
    res.status(500).json({ error: 'Server error deleting content.' });
  }
});

module.exports = router;
