// models/PlaybackLog.js

const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/database');

/**
 * PlaybackLog Model
 * Tracks content playback across stations with support for different content types
 * @extends Model
 */
class PlaybackLog extends Model {
  /**
   * Get content instance that was played
   * @returns {Promise<MusicContent|AdvertisingContent|StationContent>}
   */
  async getContent() {
    const models = this.sequelize.models;
    
    switch (this.contentType) {
      case 'MUSIC':
        return models.MusicContent.findByPk(this.musicContentId);
      case 'ADVERTISING':
        return models.AdvertisingContent.findByPk(this.advertisingContentId);
      case 'STATION':
        return models.StationContent.findByPk(this.stationContentId);
      default:
        throw new Error(`Invalid content type: ${this.contentType}`);
    }
  }

  /**
   * Get play history for specific content type
   * @param {string} contentType - Type of content to fetch history for
   * @param {Object} options - Query options
   * @returns {Promise<PlaybackLog[]>}
   */
  static async getPlayHistory(contentType, options = {}) {
    const contentIdField = `${contentType.toLowerCase()}_content_id`; // Updated to snake_case
    return this.findAll({
      where: {
        content_type: contentType, // Updated to snake_case
        [contentIdField]: { [Op.not]: null },
        ...options.where
      },
      order: [['played_at', 'DESC']], // Updated to snake_case
      ...options
    });
  }
}

PlaybackLog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  station_id: { // Changed from stationId to station_id
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'stations',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },

  content_type: { // Changed from contentType to content_type
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION'),
    allowNull: false,
    validate: {
      isIn: [['MUSIC', 'ADVERTISING', 'STATION']]
    }
  },

  music_content_id: { // Changed from musicContentId to music_content_id
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'music_contents',
      key: 'id'
    }
  },

  advertising_content_id: { // Changed from advertisingContentId to advertising_content_id
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'advertising_contents',
      key: 'id'
    }
  },

  station_content_id: { // Changed from stationContentId to station_content_id
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'station_contents',
      key: 'id'
    }
  },

  played_at: { // Changed from playedAt to played_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Actual duration played in seconds',
    validate: {
      min: 0
    }
  },

  playback_status: { // Changed from playbackStatus to playback_status
    type: DataTypes.ENUM('completed', 'skipped', 'interrupted'),
    allowNull: false,
    defaultValue: 'completed',
    validate: {
      isIn: [['completed', 'skipped', 'interrupted']]
    }
  }
}, {
  sequelize,
  modelName: 'PlaybackLog',
  tableName: 'playback_logs',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['station_id'] },
    { fields: ['content_type'] },
    { fields: ['played_at'] },
    { fields: ['music_content_id'] },
    { fields: ['advertising_content_id'] },
    { fields: ['station_content_id'] },
    // Composite indexes for efficient queries
    { fields: ['station_id', 'content_type', 'played_at'] },
    { fields: ['station_id', 'music_content_id'] },
    { fields: ['station_id', 'advertising_content_id'] },
    { fields: ['station_id', 'station_content_id'] }
  ],
  validate: {
    validateContentReference() {
      const contentIds = [
        this.music_content_id,
        this.advertising_content_id,
        this.station_content_id
      ].filter(id => id !== null);

      if (contentIds.length !== 1) {
        throw new Error('Exactly one content reference must be set');
      }

      // Validate content type matches ID
      switch (this.content_type) {
        case 'MUSIC':
          if (!this.music_content_id) {
            throw new Error('Music content type requires music_content_id');
          }
          break;
        case 'ADVERTISING':
          if (!this.advertising_content_id) {
            throw new Error('Advertising content type requires advertising_content_id');
          }
          break;
        case 'STATION':
          if (!this.station_content_id) {
            throw new Error('Station content type requires station_content_id');
          }
          break;
      }
    }
  }
});

// Define associations
PlaybackLog.associate = (models) => {
  PlaybackLog.belongsTo(models.Station, {
    foreignKey: 'station_id',
    as: 'station'
  });

  PlaybackLog.belongsTo(models.MusicContent, {
    foreignKey: 'music_content_id',
    as: 'music_content',
    constraints: false
  });

  PlaybackLog.belongsTo(models.AdvertisingContent, {
    foreignKey: 'advertising_content_id',
    as: 'advertising_content',
    constraints: false
  });

  PlaybackLog.belongsTo(models.StationContent, {
    foreignKey: 'station_content_id',
    as: 'station_content',
    constraints: false
  });
};

module.exports = PlaybackLog;
