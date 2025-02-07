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
} = require('./models');

async function generatePlaylistForStation(stationId) {
  // 1) Fetch the station
  const station = await Station.findByPk(stationId);
  if (!station) return [];

  // 2) Decide which clock template to use based on day/hour or fallback
  let templateId = null;

  // If station has a clockMapId, we find the correct slot for the current day/hour
  if (station.clockMapId) {
    const dayOfWeek = new Date().getDay(); // 0=Sun..6=Sat
    const hour = new Date().getHours();    // 0..23
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

  // If we didn't get a templateId from clockMap, fallback to station.defaultClockTemplateId
  if (!templateId && station.defaultClockTemplateId) {
    templateId = station.defaultClockTemplateId;
  }
  
  // If still no template found, return empty
  if (!templateId) return [];

  // 3) Fetch the chosen clock template + slots
  const clockTemplate = await ClockTemplate.findByPk(templateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) return [];

  // sort slots by minuteOffset
  const slots = (clockTemplate.slots || []).sort(
    (a, b) => a.minuteOffset - b.minuteOffset
  );

  const finalPlaylist = [];

  // 4) For each slot, pick content
  for (const slot of slots) {
    if (slot.slotType === 'song') {
      // Simple logic: pick first or random "song"
      const song = await Content.findOne({ where: { contentType: 'song' } });
      if (song) {
        finalPlaylist.push({
          id: song.id,
          title: song.title,
          fileName: song.fileName,
        });
      }

    } else if (slot.slotType === 'cart' && slot.cartId) {
      // Round-robin cart rotation
      const cart = await Cart.findByPk(slot.cartId);
      if (!cart) continue;

      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Content, as: 'Content' }],
      });
      if (!items.length) continue;

      let rotationIndex = cart.rotationIndex || 0;
      const picked = items[rotationIndex % items.length].Content;

      if (picked) {
        finalPlaylist.push({
          id: picked.id,
          title: picked.title,
          fileName: picked.fileName,
        });
      }

      cart.rotationIndex = (rotationIndex + 1) % items.length;
      await cart.save();
    }

    // else if "jingle" or other slotTypes, handle similarly
  }

  // 5) Log each item in PlaybackLog
  for (const item of finalPlaylist) {
    await PlaybackLog.create({
      stationId,
      contentId: item.id,
      playedAt: new Date(),
    });
  }

  // 6) Return final array
  return finalPlaylist;
}

module.exports = { generatePlaylistForStation };
