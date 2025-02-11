// routes/contentCrudRoutes.js
const express = require('express');
const router = express.Router();
const { Content, Format, ContentType, ContentLibrary } = require('../models');

// --------------------------------------------------------------------------------
// GET /api/content -> list all content
//   from your repo screenshot, it was a simple findAll() 
//   plus we can optionally include associations if desired.
router.get('/', async (req, res) => {
  try {
    // If you want to add filters for libraryId, contentType, etc., do so here.
    // For now, preserving your screenshot's simple approach:
    const allContent = await Content.findAll({
      // If you want associations, e.g.:
      // include: [ Format, ContentType, ContentLibrary ],
    });
    res.json(allContent);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Server error fetching content.' });
  }
});

// --------------------------------------------------------------------------------
// POST /api/content -> create new content
//   from your screenshot, you had fields: title, contentType, formatId, duration,
//   score, fileName, startDate, endDate, dailyStartHour, dailyEndHour, visibility.
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
      // if you also want to allow libraryId on creation
      libraryId,
    } = req.body;

    if (!title || !contentType) {
      return res
        .status(400)
        .json({ error: 'title and contentType are required.' });
    }

    // Create new content with all fields
    const newContent = await Content.create({
      title,
      contentType,
      formatId: formatId || null,
      duration: duration || null,
      score: score !== undefined ? score : 1.0,
      fileName: fileName || null,
      startDate: startDate || null,
      endDate: endDate || null,
      dailyStartHour: dailyStartHour !== undefined ? dailyStartHour : null,
      dailyEndHour: dailyEndHour !== undefined ? dailyEndHour : null,
      visibility: visibility !== undefined ? visibility : null,
      libraryId: libraryId || null,
    });

    res.json(newContent);
  } catch (err) {
    console.error('Error creating content:', err);
    res
      .status(500)
      .json({ error: 'Server error creating content.' });
  }
});

// --------------------------------------------------------------------------------
// GET /api/content/:id -> fetch single content
//   might want to include Format, ContentType, or Library
router.get('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findByPk(contentId, {
      // if you want associations:
      // include: [ Format, ContentType, ContentLibrary ],
    });
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }
    res.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    res
      .status(500)
      .json({ error: 'Server error fetching content.' });
  }
});

// --------------------------------------------------------------------------------
// PUT /api/content/:id -> update existing content
//   merges your extra fields with the new libraryId approach
router.put('/:id', async (req, res) => {
  try {
    const contentId = req.params.id;

    // Pull all fields you might want to update:
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
      libraryId,
    } = req.body;

    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    // Update each field if provided
    if (title !== undefined) content.title = title;
    if (contentType !== undefined) content.contentType = contentType;
    if (formatId !== undefined) content.formatId = formatId;
    if (duration !== undefined) content.duration = duration;
    if (score !== undefined) content.score = score;
    if (fileName !== undefined) content.fileName = fileName;
    if (startDate !== undefined) content.startDate = startDate;
    if (endDate !== undefined) content.endDate = endDate;
    if (dailyStartHour !== undefined) content.dailyStartHour = dailyStartHour;
    if (dailyEndHour !== undefined) content.dailyEndHour = dailyEndHour;
    if (visibility !== undefined) content.visibility = visibility;
    if (libraryId !== undefined) content.libraryId = libraryId;

    await content.save();
    res.json(content);
  } catch (err) {
    console.error('Error updating content:', err);
    res
      .status(500)
      .json({ error: 'Server error updating content.' });
  }
});
// routes/contentRoutes.js (or contentCrudRoutes.js)

router.put('/:id/libraries', async (req, res) => {
  try {
    const contentId = req.params.id;
    const { libraryIds } = req.body; // array of IDs

    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ error: 'Content not found.' });
    }

    // setContentLibraries is automatically created by Sequelize 
    // due to belongsToMany associations.
    await content.setContentLibraries(libraryIds || []);

    // re-fetch with included libraries
    const updated = await Content.findByPk(contentId, {
      include: [ContentLibrary],
    });
    res.json(updated);
  } catch (err) {
    console.error('Error updating content libraries:', err);
    res.status(500).json({ error: 'Server error updating libraries.' });
  }
});
// --------------------------------------------------------------------------------
// DELETE /api/content/:id -> remove content
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
    res
      .status(500)
      .json({ error: 'Server error deleting content.' });
  }
});

module.exports = router;
