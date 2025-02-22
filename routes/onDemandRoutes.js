// routes/onDemandRoutes.js

const express = require('express');
const router = express.Router();
const { 
  MusicContent, 
  AdvertisingContent, 
  StationContent,
  ClockTemplate,
  ContentLibrary,
  PlaybackLog 
} = require('../models');
const { checkPermissions } = require('../middleware/auth');
const { generatePlaylistForStation } = require('../services/playlistGenerator');

/**
 * Generate on-demand playlist with type-specific content selection
 * @route POST /api/on-demand/generate
 */
router.post('/generate', checkPermissions('playlist.generate'), function(req, res, next) {
  const {
    stationId,
    duration = 3600,
    formats,
    includeForceCarts = true,
    includeSystemCarts = true
  } = req.body;

  generatePlaylistForStation(stationId, {
    duration,
    formats,
    includeForceCarts,
    includeSystemCarts
  })
  .then(playlist => {
    res.json(playlist);
  })
  .catch(next);
});

/**
 * Get content eligibility for immediate playback
 * @route GET /api/on-demand/check-eligibility/:contentType/:id
 */
router.get('/check-eligibility/:contentType/:id', async (req, res) => {
  try {
    const { contentType, id } = req.params;
    const { stationId } = req.query;

    let content;
    let eligibility;

    switch (contentType.toUpperCase()) {
      case 'MUSIC':
        content = await MusicContent.findByPk(id);
        eligibility = await content?.checkArtistSeparation(stationId);
        break;
      case 'ADVERTISING':
        content = await AdvertisingContent.findByPk(id);
        eligibility = await content?.checkPlayEligibility(stationId);
        break;
      case 'STATION':
        content = await StationContent.findByPk(id);
        eligibility = await content?.checkPlaybackEligibility(stationId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(eligibility);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
