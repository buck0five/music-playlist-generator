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

async function generatePlaylistForStation(stationId, targetDate = new Date()) {
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

  const finalPlaylist = [];

  // For date comparisons (per cart item)
  const now = targetDate; 
  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"

  // 4) For each slot, pick content
  for (const slot of slots) {
    if (slot.slotType === 'song') {
      // pick first or random "song"
      const song = await Content.findOne({ where: { contentType: 'song' } });
      if (song) {
        finalPlaylist.push({ id: song.id, title: song.title, fileName: song.fileName });
      }
    } else if (slot.slotType === 'cart' && slot.cartId) {
      // round-robin among cart items that are "in range"
      const cart = await Cart.findByPk(slot.cartId);
      if (!cart) continue;

      // fetch pivot items
      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Content, as: 'Content' }],
      });
      if (!items.length) continue;

      // filter out items not valid for date/time
      const eligibleItems = items.filter((item) => {
        // 1) check startDate/endDate
        if (item.startDate && todayStr < item.startDate) return false;
        if (item.endDate && todayStr > item.endDate) return false;

        // 2) check daysOfWeek
        if (item.daysOfWeek) {
          const arr = item.daysOfWeek.split(',').map(Number); // "0,1,2" -> [0,1,2]
          if (!arr.includes(dayOfWeek)) return false;
        }

        // 3) check hours
        if (item.startHour != null && hour < item.startHour) return false;
        if (item.endHour != null && hour >= item.endHour) return false;

        return true;
      });

      if (!eligibleItems.length) {
        // no valid item for this slot/time
        continue;
      }

      // round-robin index from cart
      let rotationIndex = cart.rotationIndex || 0;
      const picked = eligibleItems[rotationIndex % eligibleItems.length].Content;
      if (picked) {
        finalPlaylist.push({
          id: picked.id,
          title: picked.title,
          fileName: picked.fileName,
        });
      }

      cart.rotationIndex = (rotationIndex + 1) % eligibleItems.length;
      await cart.save();
    }
    // add other slotTypes if needed
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

module.exports = { generatePlaylistForStation };
