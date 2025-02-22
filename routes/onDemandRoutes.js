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
router.post('/generate', checkPermissions('playlist.generate'), async (req, res) => {
  try {
    const {
      stationId,
      duration = 3600, // Default 1 hour
      formats,
      includeForceCarts = true,
      includeSystemCarts = true
    } = req.body;

    // Get assigned libraries for station
    const libraries = await ContentLibrary.findAll({
      where: {
        '$assignments.assignableType$': 'Station',
        '$assignments.assignableId$': stationId
      },
      include: ['assignments']
    });

    // Get clock template for current hour
    const template = await ClockTemplate.getCurrentTemplate(stationId);

    // Initialize content collectors
    const playlist = {
      music: [],
      advertising: [],
      stationContent: [],
      systemCarts: []
    };

    // Process music content
    if (formats && formats.length > 0) {
      playlist.music = await MusicContent.selectContent({
        libraries,
        formats,
        duration: Math.floor(duration * 0.75), // 75% music
        template
      });
    }

    // Process advertising content
    playlist.advertising = await AdvertisingContent.selectEligibleContent({
      libraries,
      stationId,
      template,
      duration: Math.floor(duration * 0.15) // 15% ads
    });

    // Process station content
    playlist.stationContent = await StationContent.selectContent({
      libraries,
      stationId,
      template,
      duration: Math.floor(duration * 0.10) // 10% station content
    });

    // Add system carts if requested
    if (includeSystemCarts) {
      playlist.systemCarts = await StationContent.getSystemCarts({
        stationId,
        template,
        types: ['SID1', 'TIM1', 'WEA1']
      });
    }

    // Add force carts if requested and user has permission
    if (includeForceCarts && req.user.canManageForceCarts) {
      const forceCarts = await StationContent.getForceCarts({
        stationId,
        template
      });
      playlist.systemCarts.push(...forceCarts);
    }

    // Generate final playlist
    const finalPlaylist = await generatePlaylistForStation({
      stationId,
      template,
      content: {
        ...playlist,
        totalDuration: duration
      }
    });

    res.json({
      success: true,
      playlist: finalPlaylist,
      contentStats: {
        musicCount: playlist.music.length,
        adCount: playlist.advertising.length,
        stationContentCount: playlist.stationContent.length,
        systemCartCount: playlist.systemCarts.length
      }
    });

  } catch (error) {
    console.error('Playlist generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
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
