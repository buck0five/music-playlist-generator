// routes/onDemandRoutes.js

const express = require('express');
const router = express.Router();
const { generatePlaylistForStation } = require('../generatePlaylist');
const { PlaybackLog } = require('../models');

router.post('/generate', async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }

    const playlistItems = await generatePlaylistForStation(stationId);

    // Log each item as "played" instantly
    if (playlistItems && playlistItems.length) {
      const logsToCreate = playlistItems.map((item, idx) => ({
        stationId,
        contentId: item.id, // assuming item has .id
        playedAt: new Date(Date.now() + idx * 2000), // offset 2s each for demonstration
      }));
      await PlaybackLog.bulkCreate(logsToCreate);
    }

    res.json({
      success: true,
      message: 'On-demand playlist generated & logged',
      playlist: playlistItems || [],
    });
  } catch (err) {
    console.error('Error generating on-demand playlist:', err);
    res.status(500).json({ error: 'Server error generating on-demand playlist.' });
  }
});

module.exports = router;
