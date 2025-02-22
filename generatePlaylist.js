// generatePlaylist.js

const {
  Station,
  ClockTemplate,
  ClockTemplateSlot,
  ClockMap,
  ClockMapSlot,
  Cart,
  CartItem,
  Content,
  PlaybackLog,
  MusicContent,
  AdvertisingContent,
  StationContent,
} = require('./models');
const { Op } = require('sequelize');

/**
 * Format tracker to maintain specified percentages
 */
class FormatTracker {
  constructor(formatPreferences) {
    this.preferences = formatPreferences;
    this.used = Object.keys(formatPreferences).reduce((acc, format) => {
      acc[format] = 0;
      return acc;
    }, {});
    this.totalDuration = 0;
  }

  getNextFormat() {
    return Object.entries(this.preferences)
      .reduce((lowest, [format, percentage]) => {
        const currentPercentage = (this.used[format] / this.totalDuration) * 100 || 0;
        const deficit = percentage - currentPercentage;
        return deficit > lowest.deficit ? { format, deficit } : lowest;
      }, { format: null, deficit: -Infinity }).format;
  }

  trackFormat(format, duration) {
    this.used[format] += duration;
    this.totalDuration += duration;
  }
}

async function generatePlaylistForStation({ 
  stationId, 
  targetDate = new Date(),
  formatPreferences,
  useTagScoring = false 
}) {
  // 1) Fetch the station
  const station = await Station.findByPk(stationId);
  if (!station) return [];

  // 2) If station has a clockMapId, do day/hour approach
  // else fallback to station.defaultClockTemplateId
  let templateId = null;

  // dayOfWeek/hour from targetDate
  const dayOfWeek = targetDate.getDay(); // 0=Sun..6=Sat
  const hour = targetDate.getHours();    // 0..23

  if (station.clockMapId) {
    // find clockMapSlot by dayOfWeek, hour
    const mapSlot = await ClockMapSlot.findOne({
      where: {
        clockMapId: station.clockMapId,
        dayOfWeek,
        hour,
      },
    });
    if (mapSlot) {
      templateId = mapSlot.clockTemplateId;
    }
  }

  // fallback if no clockMap or slot
  if (!templateId && station.defaultClockTemplateId) {
    templateId = station.defaultClockTemplateId;
  }
  // if still no template
  if (!templateId) return [];

  // 3) Fetch the chosen clock template with slots
  const clockTemplate = await ClockTemplate.findByPk(templateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) return [];

  // sort slots by minuteOffset
  const slots = (clockTemplate.slots || []).sort(
    (a, b) => a.minuteOffset - b.minuteOffset
  );

  const formatTracker = new FormatTracker(formatPreferences);
  const finalPlaylist = [];
  const artistHistory = new Map();

  // For date comparisons (per cart item)
  const now = targetDate; 
  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // 4) For each slot, pick content
  for (const slot of slots) {
    try {
      let content = null;

      switch (slot.slotType) {
        case 'MUSIC':
          content = await selectMusicContent({
            station,
            slot,
            formatTracker,
            artistHistory,
            useTagScoring,
            targetDate
          });
          break;

        case 'VEN1':
        case 'SVC1':
          content = await selectAdvertisingContent({
            station,
            slot,
            targetDate
          });
          break;

        case 'SID1':
        case 'TIM1':
        case 'WEA1':
          content = await selectStationContent({
            station,
            slot,
            targetDate
          });
          break;

        case 'FRC1':
          content = await selectForceCart({
            station,
            slot,
            targetDate
          });
          break;
      }

      if (content) {
        finalPlaylist.push({
          id: content.id,
          title: content.title,
          fileName: content.fileName,
          contentType: content.constructor.name,
          duration: content.duration,
          position: slot.minuteOffset
        });

        // Update tracking if music content
        if (content instanceof MusicContent) {
          formatTracker.trackFormat(content.format, content.duration);
          artistHistory.set(content.artistId, targetDate.getTime());
        }
      }

    } catch (error) {
      console.error(`Error processing slot at ${slot.minuteOffset}:`, error);
      continue;
    }
  }

  // 5) Log each item
  for (const item of finalPlaylist) {
    await PlaybackLog.create({
      stationId,
      contentId: item.id,
      playedAt: new Date(),
    });
  }

  return finalPlaylist;
}

// Helper functions referenced from original file
async function getTemplateId(station, targetDate) {
  // Reference existing template ID logic:
  // dayOfWeek/hour from targetDate
  const dayOfWeek = targetDate.getDay(); // 0=Sun..6=Sat
  const hour = targetDate.getHours();    // 0..23

  if (station.clockMapId) {
    // find clockMapSlot by dayOfWeek, hour
    const mapSlot = await ClockMapSlot.findOne({
      where: {
        clockMapId: station.clockMapId,
        dayOfWeek,
        hour,
      },
    });
    if (mapSlot) {
      return mapSlot.clockTemplateId;
    }
  }

  // fallback if no clockMap or slot
  if (station.defaultClockTemplateId) {
    return station.defaultClockTemplateId;
  }
  // if still no template
  return null;
}

module.exports = { generatePlaylistForStation };
