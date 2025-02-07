// routes/onDemandRoutes.js

const express = require('express');
const router = express.Router();
const { generatePlaylistForStation } = require('../generatePlaylist');

router.post('/generate', async (req, res) => {
  try {
    const { stationId } = req.body;
    if (!stationId) {
      return res.status(400).json({ error: 'stationId is required.' });
    }

    const playlist = await generatePlaylistForStation(stationId);
    res.json({
      success: true,
      message: 'On-demand playlist generated',
      playlist: playlist || [],
    });
  } catch (err) {
    console.error('On-demand error:', err);
    res.status(500).json({ error: 'Server error generating on-demand playlist.' });
  }
});

module.exports = router;
