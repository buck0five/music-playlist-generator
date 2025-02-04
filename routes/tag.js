// routes/tag.js
const express = require('express');
const router = express.Router();
const { Tag, ContentTag, Content } = require('../models');

// GET /api/tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Server error fetching tags.' });
  }
});

// POST /api/tags
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await Tag.create({ name });
    res.json(newTag);
  } catch (err) {
    console.error('Error creating tag:', err);
    res.status(500).json({ error: 'Server error creating tag.' });
  }
});

// Attach a tag to a content item
// POST /api/tags/attach
// body: { contentId, tagId }
router.post('/attach', async (req, res) => {
  try {
    const { contentId, tagId } = req.body;
    // optionally validate existence
    await ContentTag.create({ contentId, tagId });
    res.json({ success: true });
  } catch (err) {
    console.error('Error attaching tag to content:', err);
    res.status(500).json({ error: 'Server error attaching tag.' });
  }
});

// GET all tags for a given content
// GET /api/tags/content/:contentId
router.get('/content/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId;
    const ctEntries = await ContentTag.findAll({ where: { contentId } });
    // map to tag IDs, or eager load tags
    res.json(ctEntries);
  } catch (err) {
    console.error('Error fetching tags for content:', err);
    res.status(500).json({ error: 'Server error fetching tags for content.' });
  }
});

module.exports = router;
