// generatePlaylist.js
const fs = require('fs');
const path = require('path');
const {
  Content,
  Feedback,
  Station,
  StationSchedule,
  ClockTemplate,
  ClockTemplateSlot,
  Cart,
  CartItem,
  StationExcludedContent,
  PlaybackLog, // NEW
} = require('./models');

async function updateContentScores() {
  // ...
}

function isContentWithinDateRange(content, now = new Date(), currentHour = null) {
  // ...
  return true; // example
}

async function generateOneHourOfContent(stationId, clockTemplateId, hourOfDay = 0) {
  const hourPlaylist = [];
  const clockTemplate = await ClockTemplate.findByPk(clockTemplateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) return hourPlaylist;

  const slots = clockTemplate.slots.sort((a, b) => a.minuteOffset - b.minuteOffset);

  for (const slot of slots) {
    if (slot.slotType === 'song') {
      const bestSong = await Content.findOne({ 
        where: { contentType: 'song' },
        order: [['score', 'DESC']],
      });
      if (!bestSong) continue;

      // check exclusion, date/time-of-day, etc...
      hourPlaylist.push(bestSong);
      // **LOG** the playback
      await PlaybackLog.create({
        stationId,
        contentId: bestSong.id,
        playedAt: new Date(), // or a scheduled date if you prefer
      });
    } else if (slot.slotType === 'cart') {
      // pick random item...
      hourPlaylist.push(contentItem);
      // **LOG** the playback
      await PlaybackLog.create({
        stationId,
        contentId: contentItem.id,
        playedAt: new Date(),
      });
    }
  }
  return hourPlaylist;
}

async function generatePlaylistForStation(stationId) {
  await updateContentScores();
  const station = await Station.findByPk(stationId, { include: ['schedules'] });
  // pick schedules, day-of-week, etc...
  // push hourTracks into finalPlaylist
  // write the .m3u file
  return finalPlaylist; 
}

module.exports = {
  generatePlaylistForStation,
};
