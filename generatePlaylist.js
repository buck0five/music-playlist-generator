// generatePlaylist.js
const fs = require('fs');
const path = require('path');
const {
  Content,
  Feedback,
  Station,
  ClockTemplate,
  ClockTemplateSlot,
  Cart,
  CartItem,
  sequelize,
} = require('./models');

/**
 * (Optional) Adjust scores based on feedback (like/dislike).
 * If you aren't using a feedback system yet, you can simplify or remove this.
 */
async function updateContentScores() {
  // Example logic: for each 'like', +0.1; for each 'dislike', -0.1
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

/**
 * Generate a playlist for the given stationId using
 * the station's defaultClockTemplate. This version includes
 * debug logs and a failsafe to avoid infinite loops.
 */
async function generatePlaylistForStation(stationId) {
  console.log(`\n\n--- generatePlaylistForStation started for stationId=${stationId} ---`);

  // 1. Update content scores if needed
  await updateContentScores();

  // 2. Fetch the Station
  const station = await Station.findByPk(stationId);
  if (!station) {
    throw new Error(`Station ${stationId} not found.`);
  }

  if (!station.defaultClockTemplateId) {
    throw new Error(`Station ${stationId} has no default clock template assigned.`);
  }

  // 3. Fetch the ClockTemplate + Slots
  const clockTemplate = await ClockTemplate.findByPk(station.defaultClockTemplateId, {
    include: [{ model: ClockTemplateSlot, as: 'slots' }],
  });
  if (!clockTemplate) {
    throw new Error(`ClockTemplate ${station.defaultClockTemplateId} not found.`);
  }

  // Sort slots by minuteOffset
  const slots = clockTemplate.slots.sort((a, b) => a.minuteOffset - b.minuteOffset);

  // 4. We'll build a 1-hour playlist for debugging (3600s).
  // If you want 24 hours, set 86400, but ensure you have enough songs to fill that time.
  const SECONDS_TARGET = 3600; // 1 hour
  let totalDuration = 0;
  const playlist = [];

  let iterationCount = 0;
  const MAX_ITERATIONS = 300; // failsafe so we don't loop forever

  while (totalDuration < SECONDS_TARGET) {
    iterationCount++;
    if (iterationCount > MAX_ITERATIONS) {
      console.log('Failsafe triggered: too many iterations without reaching target duration.');
      break;
    }
    console.log(`\n[Loop iteration #${iterationCount}] totalDuration=${totalDuration}`);

    // For each slot in the clock template (like "song", "cart", etc.)
    for (const slot of slots) {
      console.log(`  Handling slot: minuteOffset=${slot.minuteOffset}, slotType=${slot.slotType}, cartId=${slot.cartId}`);

      if (slot.slotType === 'song') {
        // Try to find a top scoring song
        const bestSong = await Content.findOne({
          where: { contentType: 'song' }, // ensure your seed data matches this exact string
          order: [['score', 'DESC']],
        });

        if (!bestSong) {
          // No songs found -> break to avoid infinite loop
          console.log('  No songs found! Breaking out to avoid infinite loop...');
          totalDuration = SECONDS_TARGET; // force end
          break;
        }

        console.log(`  Found song: ${bestSong.title}, duration=${bestSong.duration}`);
        playlist.push(bestSong);
        totalDuration += bestSong.duration;
      }
      else if (slot.slotType === 'cart') {
        // We expect a cartId
        if (!slot.cartId) {
          console.log('  cart slot has no cartId, skipping.');
          continue;
        }
        const thisCart = await Cart.findByPk(slot.cartId, { include: ['cartItems'] });
        if (!thisCart) {
          console.log(`  Cart ID=${slot.cartId} not found, skipping slot.`);
          continue;
        }
        if (!thisCart.cartItems.length) {
          console.log(`  Cart ID=${thisCart.id} is empty, skipping slot.`);
          continue;
        }

        // pick a random item from the cart
        const randomIndex = Math.floor(Math.random() * thisCart.cartItems.length);
        const chosenCartItem = thisCart.cartItems[randomIndex];
        const contentItem = await Content.findByPk(chosenCartItem.contentId);
        if (!contentItem) {
          console.log('  Cart item references missing content, skipping.');
          continue;
        }

        console.log(`  Found cart content: ${contentItem.title}, duration=${contentItem.duration}`);
        playlist.push(contentItem);
        totalDuration += contentItem.duration;
      }
      else {
        console.log(`  Unknown slotType=${slot.slotType}, skipping slot.`);
      }

      // If we exceeded the target within this slot iteration, break
      if (totalDuration >= SECONDS_TARGET) {
        console.log(`  Reached or exceeded target duration (${SECONDS_TARGET})! Breaking from slots loop.`);
        break;
      }
    } // end for(slot)

    // If totalDuration >= SECONDS_TARGET, we break the while loop
    if (totalDuration >= SECONDS_TARGET) {
      console.log(`Achieved target duration: ${totalDuration} >= ${SECONDS_TARGET}. Breaking main loop.`);
      break;
    }
  } // end while

  // 5. Write out the .m3u file
  const lines = ['#EXTM3U'];
  for (const item of playlist) {
    lines.push(`#EXTINF:${item.duration},${item.title}`);
    lines.push(item.fileName);
  }
  const filePath = path.join(__dirname, `playlist_station_${stationId}.m3u`);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

  console.log(`\n--- generatePlaylistForStation finished. Wrote file ${filePath} with totalDuration=${totalDuration} seconds ---\n`);
  return playlist;
}

// Optionally export a function just to update scores:
async function updateScoresOnly() {
  await updateContentScores();
}

module.exports = {
  generatePlaylistForStation,
  updateContentScores: updateScoresOnly,
};
