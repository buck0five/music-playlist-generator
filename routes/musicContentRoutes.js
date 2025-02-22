const express = require('express');
const router = express.Router();
const { MusicContent, PlaybackLog, ContentLibrary, ClockTemplate } = require('../models');
const { validateMusicContent } = require('../middleware/validation');
const { checkPermissions } = require('../middleware/auth');
const { Op } = require('sequelize');

/**
 * Get list of music content with format/genre filtering
 * @route GET /api/music-content
 */
router.get('/', async (req, res) => {
  try {
    const {
      format,
      genre,
      artist,
      energyLevel,
      libraryType,
      page = 1,
      limit = 50
    } = req.query;

    const where = {};
    if (format) where.format = format;
    if (genre) where.genres = { [Op.contains]: [genre] };
    if (artist) where.artist = { [Op.iLike]: `%${artist}%` };
    if (energyLevel) where.energyLevel = energyLevel;

    const music = await MusicContent.findAndCountAll({
      where,
      include: [{
        model: PlaybackLog,
        attributes: ['playedAt'],
        required: false,
        limit: 1,
        order: [['playedAt', 'DESC']]
      }],
      limit,
      offset: (page - 1) * limit,
      order: [['title', 'ASC']]
    });

    // Check library type compatibility if specified
    if (libraryType) {
      music.rows = music.rows.filter(item => 
        item.isCompatibleWithLibraryType(libraryType)
      );
      music.count = music.rows.length;
    }

    res.json({
      data: music.rows,
      total: music.count,
      page,
      totalPages: Math.ceil(music.count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get format percentages for station
 * @route GET /api/music-content/format-stats/:stationId
 */
router.get('/format-stats/:stationId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await MusicContent.getFormatPercentages(
      req.params.stationId,
      startDate,
      endDate
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check clock template compatibility
 * @route GET /api/music-content/:id/clock-compatibility
 */
router.get('/:id/clock-compatibility', async (req, res) => {
  try {
    const music = await MusicContent.findByPk(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music content not found' });
    }

    const compatibility = await music.checkClockTemplateCompatibility(
      req.query.templateId,
      req.query.position
    );
    res.json(compatibility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update energy level and tags
 * @route PUT /api/music-content/:id/attributes
 */
router.put('/:id/attributes', checkPermissions('music.edit'), async (req, res) => {
  try {
    const music = await MusicContent.findByPk(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music content not found' });
    }

    const { energyLevel, tags } = req.body;
    await music.update({ 
      energyLevel,
      tags,
      updatedBy: req.user.id
    });

    res.json(music);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ... other existing routes ...

module.exports = router; 