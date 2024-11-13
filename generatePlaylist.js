// generatePlaylist.js

const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const {
  User,
  Station,
  Company,
  Platform,
  Content,
  ContentLibraryAssignment,
  ContentLibrary,
  ClockTemplate,
  ClockSegment,
} = require('./models');

const generatePlaylist = async (userId) => {
  try {
    // Fetch user with associated stations, companies, and platforms
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Station,
          as: 'AssignedStations',
          include: [
            {
              model: Company,
              as: 'Company',
              include: [
                {
                  model: Platform,
                  as: 'Platform',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // Collect IDs
    const stationIds = user.AssignedStations.map((station) => station.id);
    const companyIds = user.AssignedStations.map((station) => station.Company.id);
    const platformIds = user.AssignedStations.map(
      (station) => station.Company.Platform.id
    );

    // Fetch clock template (assumed to be default for simplicity)
    const clockTemplate = await ClockTemplate.findOne({
      where: { formatId: null },
      include: [{ model: ClockSegment, as: 'Segments' }],
      order: [[{ model: ClockSegment, as: 'Segments' }, 'order', 'ASC']],
    });

    if (!clockTemplate) {
      throw new Error('No clock template found.');
    }

    // Fetch content libraries assigned to user's entities
    const contentLibraryAssignments = await ContentLibraryAssignment.findAll({
      where: {
        [Op.or]: [
          { assignableType: 'Station', assignableId: { [Op.in]: stationIds } },
          { assignableType: 'Company', assignableId: { [Op.in]: companyIds } },
          { assignableType: 'Platform', assignableId: { [Op.in]: platformIds } },
        ],
      },
      include: {
        model: ContentLibrary,
        as: 'ContentLibrary',
        include: {
          model: Content,
          as: 'Contents',
        },
      },
    });

    // Collect all contents
    let allContents = [];
    for (const assignment of contentLibraryAssignments) {
      const contents = assignment.ContentLibrary.Contents;
      allContents = allContents.concat(contents);
    }

    // Remove duplicates
    allContents = Array.from(new Set(allContents.map((c) => c.id))).map((id) =>
      allContents.find((c) => c.id === id)
    );

    // Organize contents by type
    const contentsByType = {};
    allContents.forEach((content) => {
      if (!contentsByType[content.contentType]) {
        contentsByType[content.contentType] = [];
      }
      contentsByType[content.contentType].push(content);
    });

    // Generate playlist
    let playlistEntries = [];

    for (const segment of clockTemplate.Segments) {
      const contentType = segment.contentType;
      const availableContents = contentsByType[contentType] || [];

      if (availableContents.length === 0) {
        console.warn(`No available content for type ${contentType}. Skipping.`);
        continue;
      }

      // Select content (e.g., random selection for simplicity)
      const selectedContent =
        availableContents[Math.floor(Math.random() * availableContents.length)];

      playlistEntries.push({
        file_path: selectedContent.file_path,
        title: selectedContent.title,
      });
    }

    // Ensure the 'playlists' directory exists
    const playlistDir = path.join(__dirname, 'playlists');
    if (!fs.existsSync(playlistDir)) {
      fs.mkdirSync(playlistDir);
    }

    // Write playlist to file
    const playlistPath = path.join(playlistDir, `playlist_user_${userId}.m3u`);
    const playlistContent = playlistEntries
      .map((entry) => `#EXTINF:-1,${entry.title}\n${entry.file_path}`)
      .join('\n');

    fs.writeFileSync(playlistPath, playlistContent);

    console.log(`Playlist generated for user ${userId} at ${playlistPath}`);

    return playlistPath;
  } catch (error) {
    console.error('Error generating playlist:', error);
    throw error;
  }
};

module.exports = generatePlaylist;
