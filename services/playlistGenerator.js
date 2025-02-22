const { Station, Content, PlaybackLog, ClockTemplate } = require('../models');

const generatePlaylistForStation = async (stationId, options = {}) => {
  const {
    duration = 3600,
    formats = [],
    includeForceCarts = true,
    includeSystemCarts = true
  } = options;

  const station = await Station.findByPk(stationId);
  if (!station) {
    throw new Error('Station not found');
  }

  // Get clock template for current hour
  const template = await ClockTemplate.getCurrentTemplate(stationId);

  // This matches the structure in onDemandRoutes.js
  return {
    music: await station.getEligibleMusicContent({
      where: { format: formats },
      limit: Math.floor(duration * 0.75) // 75% music
    }),
    advertising: await station.getEligibleAdvertisingContent({
      limit: Math.floor(duration * 0.15) // 15% ads
    }),
    stationContent: await station.getStationContent({
      limit: Math.floor(duration * 0.10) // 10% station content
    })
  };
};

module.exports = {
  generatePlaylistForStation
}; 