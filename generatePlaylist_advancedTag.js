// generatePlaylist_advancedTag.js
const { Content, ContentTag, StationTagPreference } = require('./models');

/**
 * generatePlaylistForStation_AdvancedTag
 * 
 * 1. Load all content, or at least the subset matching station's format, etc.
 * 2. Compute a tag-based score for each content item.
 * 3. Sort or weigh content by that score.
 * 4. Build the final 24-hour or X-length playlist.
 */
async function generatePlaylistForStation_AdvancedTag(stationId) {
  try {
    // 1. Get all StationTagPreferences for this station => { tagId -> score }
    const prefs = await StationTagPreference.findAll({ where: { stationId } });
    const tagScoreMap = {};
    for (const p of prefs) {
      tagScoreMap[p.tagId] = p.score;
    }

    // 2. Get all content items (adjust filter logic for your case)
    const allContent = await Content.findAll({
      // e.g., where: { contentType: 'song' }, or station-based logic
    });

    // 3. For each content item, sum station's tag scores
    const scoredItems = [];
    for (const item of allContent) {
      const contentTagIds = await ContentTag.findAll({
        where: { contentId: item.id },
      });
      let totalScore = 0;
      for (const ct of contentTagIds) {
        const tScore = tagScoreMap[ct.tagId] || 0;
        totalScore += tScore;
      }
      scoredItems.push({ item, score: totalScore });
    }

    // 4. Sort descending by score
    scoredItems.sort((a, b) => b.score - a.score);

    // 5. Construct a simple "playlist" from highest to lowest
    // In real usage, you'd also integrate schedules, ads, etc.
    const playlist = scoredItems.map((si) => si.item);

    // Possibly slice or build 24-hour logic. We'll just return the sorted content
    return playlist;
  } catch (error) {
    console.error('Error in generatePlaylistForStation_AdvancedTag:', error);
    throw error;
  }
}

module.exports = {
  generatePlaylistForStation_AdvancedTag,
};
