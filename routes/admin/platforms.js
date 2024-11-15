// routes/admin/platforms.js

const express = require('express');
const router = express.Router();
const { Platform } = require('../../models');

// Get All Platforms
router.get('/', async (req, res) => {
  try {
    const platforms = await Platform.findAll();
    res.json(platforms);
  } catch (err) {
    console.error('Error fetching platforms:', err);
    res.status(500).json({ error: 'An error occurred while fetching platforms.' });
  }
});

module.exports = router;
