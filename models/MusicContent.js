const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

/**
 * MusicContent Model
 * Represents music-specific content in the system with enhanced metadata and tracking
 * @extends Model
 */
class MusicContent extends Model {
  /**
   * Find music content compatible with given format percentages
   * @param {Object} formatSplits - Map of format IDs to percentage (e.g., {1: 50, 2: 25, 3: 25})
   * @returns {Promise<MusicContent[]>} Array of compatible music content
   */
  static async findByFormatSplits(formatSplits) {
    const formatIds = Object.keys(formatSplits);
    return this.findAll({
      where: {
        formats: {
          [Op.overlap]: formatIds
        }
      }
    });
  }

  /**
   * Check if this song can be played based on artist separation rules
   * @param {number} stationId - Station ID to check against
   * @param {number} minArtistSeparation - Minimum minutes between same artist
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkArtistSeparation(stationId, minArtistSeparation = 45) {
    const PlaybackLog = this.sequelize.models.PlaybackLog;
    
    const lastArtistPlay = await PlaybackLog.findOne({
      where: {
        stationId,
        artist: this.artist
      },
      order: [['playedAt', 'DESC']]
    });

    if (!lastArtistPlay) return { canPlay: true, reason: null };

    const minutesSinceLastPlay = Math.floor(
      (new Date() - lastArtistPlay.playedAt) / (1000 * 60)
    );

    return {
      canPlay: minutesSinceLastPlay >= minArtistSeparation,
      reason: minutesSinceLastPlay < minArtistSeparation ? 
        `Artist played ${minutesSinceLastPlay} minutes ago` : null
    };
  }

  /**
   * Update play history and tracking data
   * @param {number} stationId - ID of station that played the song
   * @returns {Promise<MusicContent>} Updated instance
   */
  async updatePlayHistory(stationId) {
    const PlaybackLog = this.sequelize.models.PlaybackLog;
    
    // Update play statistics
    this.lastPlayedAt = new Date();
    this.playCount = (this.playCount || 0) + 1;

    // Create playback log entry
    await PlaybackLog.create({
      musicContentId: this.id,
      stationId,
      playedAt: this.lastPlayedAt,
      artist: this.artist,
      energyLevel: this.energyLevel
    });

    return this.save();
  }
}

MusicContent.init({
  // Basic Content Fields
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },

  // Music-Specific Fields
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  album: {
    type: DataTypes.STRING,
    allowNull: true
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1900,
      max: new Date().getFullYear()
    }
  },
  bpm: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 40,
      max: 250
    }
  },
  energyLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 10
    }
  },

  // Format & Genre Handling
  formats: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidFormats(value) {
        if (!Array.isArray(value)) {
          throw new Error('Formats must be an array');
        }
      }
    }
  },
  genres: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    validate: {
      isValidGenres(value) {
        if (!Array.isArray(value)) {
          throw new Error('Genres must be an array');
        }
      }
    }
  },

  // Scheduling & Tracking
  lastPlayedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  playCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  
  // Tag Scoring System
  tagScores: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidScores(value) {
        if (typeof value !== 'object') {
          throw new Error('Tag scores must be an object');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'MusicContent',
  tableName: 'music_contents',
  indexes: [
    { fields: ['artist'] },
    { fields: ['releaseYear'] },
    { fields: ['lastPlayedAt'] },
    { fields: ['energyLevel'] }
  ]
});

// Define associations
MusicContent.associate = (models) => {
  MusicContent.belongsToMany(models.ContentLibrary, {
    through: models.ContentLibraryContent,  // Use the shared through table
    foreignKey: 'contentId',
    constraints: false,
    scope: {
      contentType: 'MUSIC'
    }
  });
  
  MusicContent.hasMany(models.PlaybackLog, {
    foreignKey: 'musicContentId'
  });
};
module.exports = MusicContent; 
