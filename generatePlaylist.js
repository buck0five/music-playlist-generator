// generatePlaylist.js

const {
  Station,
  ClockTemplate,
  ClockTemplateSlot,
  Cart,
  CartItem,
  Content,
  PlaybackLog,
} = require('./models');

async function generatePlaylistForStation(stationId) {
  // Fetch station
  const station = await Station.findByPk(stationId);
  if (!station) return [];

  // Use station's defaultClockTemplateId
  if (!station.defaultClockTemplateId) return [];

  const clockTemplate = await ClockTemplate.findByPk(
    station.defaultClockTemplateId,
    {
      include: [{ model: ClockTemplateSlot, as: 'slots' }],
    }
  );
  if (!clockTemplate) return [];

  // sort slots
  const slots = (clockTemplate.slots || []).sort(
    (a, b) => a.minuteOffset - b.minuteOffset
  );

  const finalPlaylist = [];

  for (const slot of slots) {
    if (slot.slotType === 'song') {
      // pick any "song" from Content
      const song = await Content.findOne({ where: { contentType: 'song' } });
      if (song) {
        finalPlaylist.push({ id: song.id, title: song.title });
      }
    } else if (slot.slotType === 'cart' && slot.cartId) {
      // fetch the cart
      const cart = await Cart.findByPk(slot.cartId);
      if (!cart) continue;

      // fetch cart items
      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [{ model: Content, as: 'Content' }],
      });
      if (!items.length) continue;

      // round-robin index
      let rotationIndex = cart.rotationIndex || 0;
      const pickedItem = items[rotationIndex % items.length].Content;

      // push to final
      if (pickedItem) {
        finalPlaylist.push({ id: pickedItem.id, title: pickedItem.title });
      }

      // update cart's rotationIndex
      cart.rotationIndex = (rotationIndex + 1) % items.length;
      await cart.save();
    }
    // else handle other slotTypes if needed
  }

  // log each item to PlaybackLog
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
