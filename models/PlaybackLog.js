// models/PlaybackLog.js

const { DataTypes, Model } = require('sequelize');
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
    const contentIdField = `${contentType.toLowerCase()}ContentId`;
    return this.findAll({
      where: {
        contentType,
        [contentIdField]: { [Op.not]: null },
        ...options.where
      },
      order: [['playedAt', 'DESC']],
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

  stationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Station',
      key: 'id'
    }
  },

  contentType: {
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION'),
    allowNull: false
  },

  // Optional content references - only one should be set
  musicContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'MusicContent',
      key: 'id'
    }
  },

  advertisingContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'AdvertisingContent',
      key: 'id'
    }
  },

  stationContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'StationContent',
      key: 'id'
    }
  },

  playedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  // Additional metadata about the playback
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Actual duration played in seconds'
  },

  playbackStatus: {
    type: DataTypes.ENUM('completed', 'skipped', 'interrupted'),
    allowNull: false,
    defaultValue: 'completed'
  }
}, {
  sequelize,
  modelName: 'PlaybackLog',
  tableName: 'playback_logs',
  indexes: [
    { fields: ['stationId'] },
    { fields: ['contentType'] },
    { fields: ['playedAt'] },
    { fields: ['musicContentId'] },
    { fields: ['advertisingContentId'] },
    { fields: ['stationContentId'] },
    // Composite indexes for efficient queries
    { fields: ['stationId', 'contentType', 'playedAt'] },
    { fields: ['stationId', 'musicContentId'] },
    { fields: ['stationId', 'advertisingContentId'] },
    { fields: ['stationId', 'stationContentId'] }
  ],
  validate: {
    validateContentReference() {
      const contentIds = [
        this.musicContentId,
        this.advertisingContentId,
        this.stationContentId
      ].filter(id => id !== null);

      if (contentIds.length !== 1) {
        throw new Error('Exactly one content reference must be set');
      }

      // Validate content type matches ID
      switch (this.contentType) {
        case 'MUSIC':
          if (!this.musicContentId) {
            throw new Error('Music content type requires musicContentId');
          }
          break;
        case 'ADVERTISING':
          if (!this.advertisingContentId) {
            throw new Error('Advertising content type requires advertisingContentId');
          }
          break;
        case 'STATION':
          if (!this.stationContentId) {
            throw new Error('Station content type requires stationContentId');
          }
          break;
      }
    }
  }
});

// Define associations
PlaybackLog.associate = (models) => {
  PlaybackLog.belongsTo(models.Station, {
    foreignKey: 'stationId'
  });

  PlaybackLog.belongsTo(models.MusicContent, {
    foreignKey: 'musicContentId'
  });

  PlaybackLog.belongsTo(models.AdvertisingContent, {
    foreignKey: 'advertisingContentId'
  });

  PlaybackLog.belongsTo(models.StationContent, {
    foreignKey: 'stationContentId'
  });
};

module.exports = PlaybackLog;
