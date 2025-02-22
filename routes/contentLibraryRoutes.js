// routes/contentLibraryRoutes.js

const express = require('express');
const router = express.Router();
const { ContentLibrary, MusicContent, AdvertisingContent, StationContent } = require('../models');
const { validateContentLibrary, validateLibraryContent, validatePagination, validateContentRemoval } = require('../middleware/validation');
const { checkPermissions } = require('../middleware/auth');
const { Op } = require('sequelize');

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
router.post('/', validateContentLibrary, async (req, res) => {
  try {
    const { name, description, userId, verticalId } = req.body;
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
      include: [MusicContent, AdvertisingContent, StationContent],
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
router.put('/:id', validateContentLibrary, async (req, res) => {
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

// GET /api/content-libraries/:id/contents
router.get('/:id/contents', [validatePagination], async (req, res) => {
  try {
    const { contentType, page = 1, limit = 50 } = req.query;
    const library = await ContentLibrary.findByPk(req.params.id);
    
    if (!library) {
      return res.status(404).json({ error: 'Library not found' });
    }

    // Get allowed content types for this library
    const allowedTypes = library.getAllowedContentModels();
    if (contentType && !allowedTypes.includes(`${contentType}Content`)) {
      return res.status(400).json({ 
        error: `Content type ${contentType} not allowed in ${library.libraryType} libraries` 
      });
    }

    const contents = await library.getContents({
      contentType,
      page,
      limit
    });

    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/content-libraries/:id/add-content
router.post('/:id/add-content', validateLibraryContent, async (req, res) => {
  try {
    const library = req.library;
    const { contentType, contentId } = req.body;
    let content;

    switch (contentType) {
      case 'MUSIC':
        content = await MusicContent.findByPk(contentId);
        break;
      case 'ADVERTISING':
        content = await AdvertisingContent.findByPk(contentId);
        break;
      case 'STATION':
        content = await StationContent.findByPk(contentId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const compatibility = await library.isContentCompatible(content);
    if (!compatibility.isCompatible) {
      return res.status(400).json({ error: compatibility.reason });
    }

    await library.addContent(content, {
      through: {
        contentType,
        addedBy: req.user.id
      }
    });

    res.json({ message: 'Content added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/content-libraries/:id/content-stats
router.get('/:id/content-stats', async (req, res) => {
  try {
    const library = await ContentLibrary.findByPk(req.params.id);
    if (!library) {
      return res.status(404).json({ error: 'Library not found' });
    }

    const stats = await library.getContentStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/content-libraries/:id/remove-content
router.delete('/:id/remove-content', validateContentRemoval, async (req, res) => {
  try {
    const library = await ContentLibrary.findByPk(req.params.id);
    if (!library) {
      return res.status(404).json({ error: 'Library not found' });
    }

    const { contentType, contentId } = req.body;
    await library.removeContent(contentType, contentId);
    
    res.json({ message: 'Content removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
