// generatePlaylist.js
const { StationSchedule, ClockTemplate } = require('./models');
// Possibly also need { createPlaylistFromClockTemplate } or something

async function generatePlaylistForStation(stationId) {
  try {
    // 1. Get current dayOfWeek and hour
    const now = new Date();
    const currentDay = now.getDay(); // 0=Sunday..6=Saturday
    const currentHour = now.getHours(); // 0..23

    // 2. Find all schedules for this station
    const schedules = await StationSchedule.findAll({
      where: { stationId },
    });

    // 3. Filter by dayOfWeek/time-of-day
    const matchingSchedules = schedules.filter((sch) => {
      // If dayOfWeek is not null, it must match currentDay
      if (sch.dayOfWeek !== null && sch.dayOfWeek !== currentDay) {
        return false;
      }
      // TIME-OF-DAY LOGIC
      // e.g. if endHour < startHour, might wrap midnight, but let's keep it simple
      if (currentHour < sch.startHour || currentHour > sch.endHour) {
        return false;
      }
      return true;
    });

    // 4. Pick the first match or fallback
    let chosenSchedule = matchingSchedules[0];
    if (!chosenSchedule) {
      // No matching schedule? fallback or error
      // e.g. pick the first schedule from the DB, or throw an error
      chosenSchedule = schedules[0]; // fallback if you want
      if (!chosenSchedule) {
        throw new Error('No schedules found for station, cannot generate playlist.');
      }
    }

    // 5. Get the clock template
    const clockTemplateId = chosenSchedule.clockTemplateId;
    const clockTemplate = await ClockTemplate.findByPk(clockTemplateId, {
      // possibly include slots if you want them
    });

    if (!clockTemplate) {
      throw new Error(`Clock Template ${clockTemplateId} not found.`);
    }

    // 6. Build the playlist from that clock template
    // This is pseudo-code. Adjust to your existing logic:
    const playlist = createPlaylistFromClockTemplate(clockTemplate);

    // Return the final playlist
    return playlist;
  } catch (error) {
    console.error('Error generating playlist:', error);
    throw error;
  }
}

// Example helper function
function createPlaylistFromClockTemplate(clockTemplate) {
  // do something with clockTemplate, maybe clockTemplate.slots, etc.
  const playlist = [];
  // ...build a 24-hour sequence
  return playlist;
}

module.exports = {
  generatePlaylistForStation,
};
