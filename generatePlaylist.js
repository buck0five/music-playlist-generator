// generatePlaylist.js

const { Station, ClockTemplate, ClockTemplateSlot, CartItem, Content, PlaybackLog } = require('./models');

async function generatePlaylistForStation(stationId) {
  const station = await Station.findByPk(stationId);
  if (!station) return [];

  if (!station.defaultClockTemplateId) return [];

  const ct = await ClockTemplate.findByPk(station.defaultClockTemplateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!ct) return [];

  const slots = (ct.slots || []).sort((a, b) => a.minuteOffset - b.minuteOffset);
  const final = [];

  for (const slot of slots) {
    if (slot.slotType === 'song') {
      const song = await Content.findOne({ where: { contentType: 'song' } });
      if (song) final.push({ id: song.id, title: song.title });
    } else if (slot.slotType === 'cart' && slot.cartId) {
      const items = await CartItem.findAll({
        where: { cartId: slot.cartId },
        include: [{ model: Content, as: 'Content' }],
      });
      if (items.length) {
        const picked = items[0].Content;
        if (picked) final.push({ id: picked.id, title: picked.title });
      }
    }
  }

  for (const item of final) {
    await PlaybackLog.create({
      stationId,
      contentId: item.id,
      playedAt: new Date(),
    });
  }

  return final;
}

module.exports = { generatePlaylistForStation };
