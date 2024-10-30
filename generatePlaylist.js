// generatePlaylist.js

const {
  Content,
  Feedback,
  ClockTemplate,
  ClockSegment,
  Cart,
} = require('./models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const fs = require('fs');
const path = require('path');
// const { exec } = require('child_process');
// const { remoteUser, remoteHost, remotePath } = require('./config'); // Commented out as per your note

// Helper function to shuffle arrays
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Helper function to format content entries for the playlist
const formatContentEntry = (content) => {
  return `#EXTINF:${content.duration},${content.artist || ''} - ${content.title}\n${content.file_path}\n`;
};

// Function to update content scores based on feedback
const updateContentScores = async () => {
  try {
    // Reset scores for all songs
    await Content.update({ score: 0 }, { where: { contentType: 'song' } });

    // Retrieve all feedback entries
    const feedbacks = await Feedback.findAll();

    // Update scores based on feedback
    for (const feedback of feedbacks) {
      const content = await Content.findByPk(feedback.contentId);
      if (content && content.contentType === 'song') {
        content.score += feedback.feedbackType === 'like' ? 1 : -1;
        await content.save();
      }
    }
  } catch (error) {
    console.error('Error updating content scores:', error);
    throw error;
  }
};

// Main function to generate the playlist
const generatePlaylist = async (preferredFormats) => {
  try {
    // Update content scores before generating the playlist
    await updateContentScores();

    // Fetch the clock template
    const clockTemplate = await ClockTemplate.findOne({
      // If you have format-specific templates, you can include a where clause
      where: {
        // formatId: { [Op.in]: preferredFormats },
      },
      include: {
        model: ClockSegment,
        as: 'ClockSegments',
      },
      order: [[{ model: ClockSegment, as: 'ClockSegments' }, 'order', 'ASC']],
    });

    if (!clockTemplate) {
      throw new Error('No clock template found.');
    }

    // Prepare content pools for each content type
    const contentPools = {};

    // Get unique content types from clock segments
    const contentTypes = [
      ...new Set(
        clockTemplate.ClockSegments.map((segment) => segment.contentType)
      ),
    ];

    for (const type of contentTypes) {
      let contents = [];

      // Fetch carts of the corresponding type
      const carts = await Cart.findAll({
        where: { type },
        include: [
          {
            model: Content,
            through: { attributes: [] },
            where:
              type === 'song'
                ? { formatId: { [Op.in]: preferredFormats } }
                : {},
            order: [['score', 'DESC']],
          },
        ],
      });

      // Combine contents from all carts
      for (const cart of carts) {
        contents.push(...cart.Contents);
      }

      if (contents.length === 0) {
        throw new Error(`No content found for content type: ${type}`);
      }

      // Implement rotation policy: Sort by lastPlayedAt and playCount
      contents.sort((a, b) => {
        const aTime = a.lastPlayedAt ? new Date(a.lastPlayedAt) : new Date(0);
        const bTime = b.lastPlayedAt ? new Date(b.lastPlayedAt) : new Date(0);
        if (aTime - bTime !== 0) {
          return aTime - bTime;
        } else {
          return a.playCount - b.playCount;
        }
      });

      contentPools[type] = contents;
    }

    // Generate the playlist based on the clock template
    let playlistContent = '#EXTM3U\n';
    let playlistDuration = 0;
    const maxPlaylistDuration = 86400; // 24 hours in seconds

    while (playlistDuration < maxPlaylistDuration) {
      for (const segment of clockTemplate.ClockSegments) {
        const { contentType } = segment;
        const pool = contentPools[contentType];

        if (!pool || pool.length === 0) {
          console.warn(`No available content for type: ${contentType}`);
          continue;
        }

        let contentItem;
        const now = new Date();

        // Implement rotation policy
        const MIN_ROTATION_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

        for (let i = 0; i < pool.length; i++) {
          const candidate = pool[i];
          const lastPlayedAt = candidate.lastPlayedAt
            ? new Date(candidate.lastPlayedAt)
            : new Date(0);
          const timeSinceLastPlayed = now - lastPlayedAt;

          if (timeSinceLastPlayed >= MIN_ROTATION_INTERVAL) {
            contentItem = candidate;
            // Move the selected content to the end of the pool
            pool.splice(i, 1);
            pool.push(contentItem);
            break;
          }
        }

        if (!contentItem) {
          // If all content has been played recently, pick the least recently played
          contentItem = pool.shift();
          pool.push(contentItem);
        }

        // Update lastPlayedAt and playCount
        contentItem.lastPlayedAt = now;
        contentItem.playCount = (contentItem.playCount || 0) + 1;
        await contentItem.save();

        playlistContent += formatContentEntry(contentItem);
        playlistDuration += contentItem.duration;

        if (playlistDuration >= maxPlaylistDuration) {
          break;
        }
      }
    }

    // Save the playlist to a file
    const playlistPath = path.join(__dirname, 'playlist.m3u');
    fs.writeFileSync(playlistPath, playlistContent);
    console.log('Playlist generated successfully!');

    // Since you're skipping the remote upload, this part is commented out
    /*
    if (remoteUser && remoteHost && remotePath) {
      await uploadPlaylist(playlistPath);
    } else {
      console.log('Remote server not configured. Skipping upload.');
    }
    */

    return playlistPath;
  } catch (error) {
    console.error('Error generating playlist:', error);
    throw error;
  }
};

// Export the generatePlaylist function
module.exports = generatePlaylist;
