// routes/contentLibraryRoutes.js

const express = require('express');
const router = express.Router();
const { ContentLibrary, Content } = require('../models');

// GET /api/content-libraries -> list all libraries
router.get('/', async (req, res) => {
  try {
    const libs = await ContentLibrary.findAll();
    res.json(libs);
  } catch (err) {
    console.error('Error fetching content libraries:', err);
    res.status(500).json({ error: 'Server error fetching content libraries.' });
  }
});

// POST /api/content-libraries -> create a new library
router.post('/', async (req, res) => {
  try {
    const { name, description, userId, verticalId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Library name is required.' });
    }
    // userId or verticalId can be null or set as needed
    const newLib = await ContentLibrary.create({
      name,
      description,
      userId: userId || null,
      verticalId: verticalId || null,
    });
    res.json(newLib);
  } catch (err) {
    console.error('Error creating content library:', err);
    res.status(500).json({ error: 'Server error creating library.' });
  }
});

// GET /api/content-libraries/:id -> fetch one library + contents
router.get('/:id', async (req, res) => {
  try {
    const libId = req.params.id;
    const lib = await ContentLibrary.findByPk(libId, {
      include: [Content],
    });
    if (!lib) {
      return res.status(404).json({ error: 'Library not found.' });
    }
    res.json(lib);
  } catch (err) {
    console.error('Error fetching library:', err);
    res.status(500).json({ error: 'Server error fetching library.' });
  }
});

// PUT /api/content-libraries/:id -> update library name, desc, userId, verticalId
router.put('/:id', async (req, res) => {
  try {
    const libId = req.params.id;
    const { name, description, userId, verticalId } = req.body;
    const lib = await ContentLibrary.findByPk(libId);
    if (!lib) return res.status(404).json({ error: 'Library not found.' });

    if (name !== undefined) lib.name = name;
    if (description !== undefined) lib.description = description;
    if (userId !== undefined) lib.userId = userId;
    if (verticalId !== undefined) lib.verticalId = verticalId;

    await lib.save();
    res.json(lib);
  } catch (err) {
    console.error('Error updating library:', err);
    res.status(500).json({ error: 'Server error updating library.' });
  }
});

// DELETE /api/content-libraries/:id
router.delete('/:id', async (req, res) => {
  try {
    const libId = req.params.id;
    const lib = await ContentLibrary.findByPk(libId);
    if (!lib) return res.status(404).json({ error: 'Library not found.' });

    await lib.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting library:', err);
    res.status(500).json({ error: 'Server error deleting library.' });
  }
});

module.exports = router;
