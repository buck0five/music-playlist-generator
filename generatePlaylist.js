// generatePlaylist.js

const { Content, Feedback, ClockTemplate, ClockSegment } = require('./models');
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
    const contentTypes = [...new Set(clockTemplate.ClockSegments.map(segment => segment.contentType))];

    // Fetch content for each content type
    for (const type of contentTypes) {
      let contents;
      if (type === 'song') {
        contents = await Content.findAll({
          where: {
            contentType: 'song',
            formatId: { [Op.in]: preferredFormats },
          },
          order: [['score', 'DESC']],
        });
      } else {
        contents = await Content.findAll({
          where: { contentType: type },
        });
      }

      if (contents.length === 0) {
        throw new Error(`No content found for content type: ${type}`);
      }

      contentPools[type] = shuffleArray(contents);
    }

    // Generate the playlist based on the clock template
    let playlistContent = '#EXTM3U\n';
    let playlistDuration = 0;
    const maxPlaylistDuration = 86400; // 24 hours in seconds

    while (playlistDuration < maxPlaylistDuration) {
      for (const segment of clockTemplate.ClockSegments) {
        const { contentType } = segment;
        const pool = contentPools[contentType];

        // Rotate through the pool to prevent immediate repeats
        const contentItem = pool.shift();
        pool.push(contentItem);

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
