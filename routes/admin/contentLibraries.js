// routes/admin/contentLibraries.js

const express = require('express');
const router = express.Router();
const { ContentLibrary } = require('../../models');

// Get All Content Libraries
router.get('/', async (req, res) => {
  try {
    const contentLibraries = await ContentLibrary.findAll();
    res.json(contentLibraries);
  } catch (err) {
    console.error('Error fetching content libraries:', err);
    res.status(500).json({ error: 'An error occurred while fetching content libraries.' });
  }
});

// Create Content Library
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Content library name is required.' });
  }

  try {
    const contentLibrary = await ContentLibrary.create({ name });
    res.status(201).json({
      message: 'Content library created successfully.',
      contentLibrary,
    });
  } catch (err) {
    console.error('Error creating content library:', err);
    res.status(500).json({ error: 'An error occurred while creating the content library.' });
  }
});

// Delete Content Library
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const contentLibrary = await ContentLibrary.findByPk(id);

    if (!contentLibrary) {
      return res.status(404).json({ error: 'Content library not found.' });
    }

    await contentLibrary.destroy();

    res.json({ message: 'Content library deleted successfully.' });
  } catch (err) {
    console.error('Error deleting content library:', err);
    res.status(500).json({ error: 'An error occurred while deleting the content library.' });
  }
});

module.exports = router;
