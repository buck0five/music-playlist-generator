// routes/onDemandRoutes.js

const express = require('express');
const router = express.Router();
const { generatePlaylistForStation } = require('../generatePlaylist');
// If you want to log to a PlaybackLog or do advanced logic, import additional models here.

router.post('/generate', async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }
    // Example call to your existing generator function
    const playlistItems = await generatePlaylistForStation(stationId);

    // If you want to log these items in PlaybackLog, do so here.
    // For now, just return them.
    res.json({
      success: true,
      message: 'On-demand playlist generated',
      playlist: playlistItems || [],
    });
  } catch (err) {
    console.error('Error generating on-demand playlist:', err);
    res.status(500).json({ error: 'Server error generating on-demand playlist.' });
  }
});

module.exports = router;
