// models/Station.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Station extends Model {
  /**
   * Get eligible music content for this station
   * @param {Object} options Query options
   * @returns {Promise<MusicContent[]>}
   */
  async getEligibleMusicContent(options = {}) {
    const { ContentLibrary, MusicContent } = this.sequelize.models;
    const libraries = await this.getLibraries();
    const libraryIds = libraries.map(lib => lib.id);

    return MusicContent.findAll({
      include: [{
        model: ContentLibrary,
        where: { id: libraryIds },
        through: { attributes: [] }
      }],
      ...options
    });
  }

  /**
   * Get eligible advertising content
   * @param {Object} options Query options
   * @returns {Promise<AdvertisingContent[]>}
   */
  async getEligibleAdvertisingContent(options = {}) {
    // Reference Content model's eligibility checking
    ```javascript:models/Content.js
    startLine: 234
    endLine: 281
    ```
  }

  /**
   * Get station-specific content
   * @param {Object} options Query options
   * @returns {Promise<StationContent[]>}
   */
  async getStationContent(options = {}) {
    return this.getContents({
      where: { contentType: 'STATION' },
      ...options
    });
  }

  /**
   * Calculate format distribution for a time period
   * @param {Date} startDate Period start
   * @param {Date} endDate Period end
   * @returns {Promise<Object>} Format percentages
   */
  async getFormatDistribution(startDate, endDate) {
    // Reference PlaybackLog's content type handling
    ```javascript:models/PlaybackLog.js
    startLine: 16
    endLine: 29
    ```
  }
}

Station.init(
  {
    // Preserving fields from your repo
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // If you have a defaultClockTemplateId field:
    defaultClockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // If you have a clockMapId field:
    clockMapId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // NEW: references a vertical/segment
    verticalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // UserId for station manager:
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active'
    },

    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        enableTagScoring: true,
        artistSeparation: 30, // minutes
        formatPercentages: {},
        contentTypeRatios: {
          MUSIC: 0.75,
          ADVERTISING: 0.15,
          STATION: 0.10
        }
      },
      validate: {
        isValidSettings(value) {
          if (!value.contentTypeRatios) {
            throw new Error('Content type ratios must be defined');
          }
          const total = Object.values(value.contentTypeRatios).reduce((sum, v) => sum + v, 0);
          if (Math.abs(total - 1) > 0.001) {
            throw new Error('Content type ratios must sum to 1');
          }
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Station',
    tableName: 'stations',
    indexes: [
      { fields: ['status'] }
    ]
  }
);

// Define associations
Station.associate = (models) => {
  // Library associations
  Station.belongsToMany(models.ContentLibrary, {
    through: 'StationLibraries',
    as: 'libraries'
  });

  // Content type specific associations
  Station.hasMany(models.PlaybackLog);
  Station.hasMany(models.StationTagPreference);
  
  // Clock template associations
  Station.belongsTo(models.ClockTemplate, {
    as: 'activeTemplate',
    constraints: false
  });
  
  Station.belongsTo(models.ClockMap, {
    as: 'activeClockMap',
    constraints: false
  });

  // Content exclusions
  Station.belongsToMany(models.MusicContent, {
    through: 'StationExcludedContent',
    as: 'excludedMusic'
  });

  Station.belongsToMany(models.AdvertisingContent, {
    through: 'StationExcludedContent',
    as: 'excludedAds'
  });
};

module.exports = Station;
