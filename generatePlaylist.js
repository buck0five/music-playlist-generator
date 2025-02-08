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
  // 1) Fetch station
  const station = await Station.findByPk(stationId);
  if (!station) return [];

  // 2) Determine dayOfWeek from targetDate
  // 0=Sunday..6=Saturday
  const dayOfWeek = targetDate.getDay();
  // If you only want a certain day, pass in a date with the right dayOfWeek

  // 3) If station has a clockMapId, find the clock template for each hour
  if (!station.clockMapId) {
    // fallback to defaultClockTemplateId if you want or just empty
    if (!station.defaultClockTemplateId) return [];
    return generatePlaylistUsingSingleTemplate(station.defaultClockTemplateId);
  }

  // Build a 24-hour (or however many hours you need) playlist for that day
  const finalPlaylist = [];

  for (let hour = 0; hour < 24; hour++) {
    // find the ClockMapSlot for (dayOfWeek, hour)
    const slot = await ClockMapSlot.findOne({
      where: { clockMapId: station.clockMapId, dayOfWeek, hour },
    });
    if (!slot) {
      // no template assigned for this hour
      continue;
    }

    // fetch the clock template
    const clockTemplate = await ClockTemplate.findByPk(slot.clockTemplateId, {
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    });
    if (!clockTemplate) continue;

    // sort by minuteOffset
    const templateSlots = (clockTemplate.slots || []).sort(
      (a, b) => a.minuteOffset - b.minuteOffset
    );

    // For each slot in that hour, pick content
    for (const tSlot of templateSlots) {
      if (tSlot.slotType === 'song') {
        const song = await Content.findOne({ where: { contentType: 'song' } });
        if (song) {
          finalPlaylist.push({ id: song.id, title: song.title });
        }
      } else if (tSlot.slotType === 'cart' && tSlot.cartId) {
        const cart = await Cart.findByPk(tSlot.cartId);
        if (!cart) continue;

        const items = await CartItem.findAll({
          where: { cartId: cart.id },
          include: [{ model: Content, as: 'Content' }],
        });
        if (!items.length) continue;

        let rotationIndex = cart.rotationIndex || 0;
        const pickedItem = items[rotationIndex % items.length].Content;
        if (pickedItem) {
          finalPlaylist.push({ id: pickedItem.id, title: pickedItem.title });
        }
        cart.rotationIndex = (rotationIndex + 1) % items.length;
        await cart.save();
      }
      // handle jingle, etc., if needed
    }
  }

  // Log all items
  for (const item of finalPlaylist) {
    await PlaybackLog.create({
      stationId,
      contentId: item.id,
      playedAt: new Date(),
    });
  }

  return finalPlaylist;
}

// if fallback needed for single-template stations
async function generatePlaylistUsingSingleTemplate(templateId) {
  const clockTemplate = await ClockTemplate.findByPk(templateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) return [];

  const slots = (clockTemplate.slots || []).sort(
    (a, b) => a.minuteOffset - b.minuteOffset
  );
  const final = [];
  for (const s of slots) {
    // your slot logic (song/cart rotation) same as above
    // ...
  }
  // log final items...
  return final;
}

module.exports = { generatePlaylistForStation };
