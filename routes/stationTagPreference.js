// routes/stationTagPreference.js
const express = require('express');
const router = express.Router();
const { ContentTag, StationTagPreference } = require('../models');

/**
 * POST /api/station-tag-preference/feedback
 * Body: { stationId, contentId, feedbackType: "like" or "dislike" }
 *
 * This route updates StationTagPreference scores based on feedback.
 */
router.post('/feedback', async (req, res) => {
  try {
    const { stationId, contentId, feedbackType } = req.body;
    if (!stationId || !contentId || !feedbackType) {
      return res
        .status(400)
        .json({ error: 'stationId, contentId, feedbackType required.' });
    }

    // 1. Find all tags for this content
    const contentTags = await ContentTag.findAll({ where: { contentId } });
    if (!contentTags.length) {
      // no tags? no scoring changes
      return res.json({ success: true, message: 'No tags on content, nothing to update.' });
    }

    // 2. Determine the delta (+1 for "like", -1 for "dislike", etc.)
    let delta = 0;
    if (feedbackType === 'like') delta = 1;
    else if (feedbackType === 'dislike') delta = -1;

    // 3. Update or create StationTagPreference for each tag
    for (const ct of contentTags) {
      const tagId = ct.tagId;

      let pref = await StationTagPreference.findOne({ where: { stationId, tagId } });
      if (!pref) {
        // create it with score=0
        pref = await StationTagPreference.create({ stationId, tagId, score: 0 });
      }
      // adjust the score
      pref.score += delta;
      await pref.save();
    }

    res.json({ success: true, message: 'Tag scores updated.' });
  } catch (err) {
    console.error('Error updating station tag preference:', err);
    res.status(500).json({ error: 'Server error updating tag scores.' });
  }
});

module.exports = router;
