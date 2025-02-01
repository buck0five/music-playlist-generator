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
} = require('./models');

// (1) Optional feedback scoring
async function updateContentScores() {
  const allFeedback = await Feedback.findAll();
  for (const fb of allFeedback) {
    const content = await Content.findByPk(fb.contentId);
    if (!content) continue;
    if (fb.feedbackType === 'like') {
      content.score += 0.1;
    } else if (fb.feedbackType === 'dislike') {
      content.score -= 0.1;
    }
    await content.save();
  }
}

// (2) Helper to check if a content item is within startDate/endDate
function isContentWithinDateRange(content, now = new Date()) {
  // If startDate is set and now < startDate => Not valid yet
  if (content.startDate && now < content.startDate) {
    return false;
  }
  // If endDate is set and now > endDate => Expired
  if (content.endDate && now > content.endDate) {
    return false;
  }
  return true;
}

// (3) Generate ~1 hour from a single clock template
async function generateOneHourOfContent(clockTemplateId) {
  const MAX_SECONDS_HOUR = 3600;
  let hourDuration = 0;
  const hourPlaylist = [];

  // Load the template & slots
  const clockTemplate = await ClockTemplate.findByPk(clockTemplateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) {
    console.log(`generateOneHourOfContent: ClockTemplate ${clockTemplateId} not found.`);
    return hourPlaylist;
  }

  const slots = clockTemplate.slots.sort((a, b) => a.minuteOffset - b.minuteOffset);

  // Single pass over slots
  for (const slot of slots) {
    if (slot.slotType === 'song') {
      // Find a top scoring song
      const bestSong = await Content.findOne({
        where: { contentType: 'song' },
        order: [['score', 'DESC']],
      });
      if (!bestSong) {
        console.log('No songs found (slotType=song), skipping.');
        continue;
      }

      // Check date range
      if (!isContentWithinDateRange(bestSong)) {
        console.log(`Song "${bestSong.title}" is out of date range, skipping.`);
        continue;
      }

      hourPlaylist.push(bestSong);
      hourDuration += bestSong.duration;
    }
    else if (slot.slotType === 'cart') {
      // Find the cart, pick random item
      if (!slot.cartId) {
        console.log(`Slot is cart but cartId is missing, skipping.`);
        continue;
      }
      const theCart = await Cart.findByPk(slot.cartId, { include: ['cartItems'] });
      if (!theCart || !theCart.cartItems.length) {
        console.log(`Cart #${slot.cartId} not found or empty, skipping slot.`);
        continue;
      }
      // Random pick
      const randIndex = Math.floor(Math.random() * theCart.cartItems.length);
      const cartItem = theCart.cartItems[randIndex];
      const contentItem = await Content.findByPk(cartItem.contentId);
      if (!contentItem) {
        console.log('Cart item references missing content, skipping.');
        continue;
      }

      // Check date range for cart item
      if (!isContentWithinDateRange(contentItem)) {
        console.log(`Cart content "${contentItem.title}" is out of date range, skipping slot.`);
        continue;
      }

      hourPlaylist.push(contentItem);
      hourDuration += contentItem.duration;
    }
    // else other slot types if needed
  }
  console.log(
    `generateOneHourOfContent -> templateId=${clockTemplateId}, hourPlaylist length=${hourPlaylist.length}, totalSec=${hourDuration}`
  );
  return hourPlaylist;
}

// (4) Main function: build 24-hour schedule via dayparting
async function generatePlaylistForStation(stationId) {
  console.log(`\n--- generatePlaylistForStation: stationId=${stationId} ---\n`);
  await updateContentScores();

  const station = await Station.findByPk(stationId, {
    include: [{ model: StationSchedule, as: 'schedules' }],
  });
  if (!station) {
    throw new Error(`Station ${stationId} not found.`);
  }

  const HOURS_PER_DAY = 24;
  const finalPlaylist = [];

  for (let hour = 0; hour < HOURS_PER_DAY; hour++) {
    // find a schedule
    let matchedSchedule = null;
    for (const sched of station.schedules) {
      if (hour >= sched.startHour && hour <= sched.endHour) {
        matchedSchedule = sched;
        break;
      }
    }

    let templateToUse = null;
    if (matchedSchedule) {
      templateToUse = matchedSchedule.clockTemplateId;
      console.log(`Hour ${hour}: using schedule clockTemplateId=${templateToUse}`);
    } else {
      if (!station.defaultClockTemplateId) {
        console.log(`Hour ${hour}: no schedule + no default, skipping hour.`);
        continue;
      }
      templateToUse = station.defaultClockTemplateId;
      console.log(`Hour ${hour}: using defaultClockTemplateId=${templateToUse}`);
    }

    // Generate one hour
    const hourTracks = await generateOneHourOfContent(templateToUse);
    finalPlaylist.push(...hourTracks);
  }

  // Write .m3u
  const lines = ['#EXTM3U'];
  let sumDuration = 0;
  for (const item of finalPlaylist) {
    lines.push(`#EXTINF:${item.duration},${item.title}`);
    lines.push(item.fileName);
    sumDuration += item.duration;
  }
  const filePath = path.join(__dirname, `playlist_station_${stationId}.m3u`);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

  console.log(
    `\n--- Done generating 24-hour playlist for stationId=${stationId}. Tracks=${finalPlaylist.length}, totalDuration=${sumDuration}`
  );
  return finalPlaylist;
}

module.exports = {
  generatePlaylistForStation,
};
