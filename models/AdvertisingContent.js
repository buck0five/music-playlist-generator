const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

/**
 * AdvertisingContent Model
 * Represents advertising-specific content with enhanced scheduling and tracking
 * @extends Model
 */
class AdvertisingContent extends Model {
  /**
   * Check if this advertisement is eligible to play based on all scheduling rules
   * @param {number} stationId - Station ID to check against
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkPlayEligibility(stationId) {
    // Check scheduling rules
    const scheduleCheck = await this.checkSchedulingRules();
    if (!scheduleCheck.canPlay) return scheduleCheck;

    // Check play count requirements
    const playCountCheck = await this.checkPlayCountRequirements(stationId);
    if (!playCountCheck.canPlay) return playCountCheck;

    // Check vertical restrictions
    const verticalCheck = await this.checkVerticalRestrictions(stationId);
    if (!verticalCheck.canPlay) return verticalCheck;

    return { canPlay: true, reason: null };
  }

  /**
   * Check if advertisement is within its scheduled play period
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkSchedulingRules() {
    const now = new Date();
    const currentHour = now.getHours();

    if (this.startDate && this.startDate > now) {
      return { 
        canPlay: false, 
        reason: 'Campaign has not started yet'
      };
    }

    if (this.endDate && this.endDate < now) {
      return { 
        canPlay: false, 
        reason: 'Campaign has ended'
      };
    }

    if (this.playHourRestrictions?.length > 0 
        && !this.playHourRestrictions.includes(currentHour)) {
      return {
        canPlay: false,
        reason: 'Outside allowed play hours'
      };
    }

    return { canPlay: true, reason: null };
  }

  /**
   * Check if play count requirements are met
   * @param {number} stationId - Station ID to check against
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkPlayCountRequirements(stationId) {
    const PlaybackLog = this.sequelize.models.PlaybackLog;
    
    // Check daily play count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayPlays = await PlaybackLog.count({
      where: {
        advertisingContentId: this.id,
        stationId,
        playedAt: {
          [Op.gte]: todayStart
        }
      }
    });

    if (this.maxPlaysPerDay && todayPlays >= this.maxPlaysPerDay) {
      return {
        canPlay: false,
        reason: 'Daily play limit reached'
      };
    }

    // Check minimum spacing between plays
    const lastPlay = await PlaybackLog.findOne({
      where: {
        advertisingContentId: this.id,
        stationId
      },
      order: [['playedAt', 'DESC']]
    });

    if (lastPlay) {
      const minutesSinceLastPlay = Math.floor(
        (new Date() - lastPlay.playedAt) / (1000 * 60)
      );
      
      if (minutesSinceLastPlay < this.minMinutesBetweenPlays) {
        return {
          canPlay: false,
          reason: `Minimum spacing not met (${minutesSinceLastPlay}/${this.minMinutesBetweenPlays} minutes)`
        };
      }
    }

    return { canPlay: true, reason: null };
  }

  /**
   * Update play history and tracking data
   * @param {number} stationId - ID of station that played the ad
   * @returns {Promise<AdvertisingContent>} Updated instance
   */
  async updatePlayHistory(stationId) {
    const PlaybackLog = this.sequelize.models.PlaybackLog;
    
    this.lastPlayedAt = new Date();
    this.playCount = (this.playCount || 0) + 1;

    await PlaybackLog.create({
      advertisingContentId: this.id,
      stationId,
      playedAt: this.lastPlayedAt,
      campaignId: this.campaignId,
      priority: this.priority
    });

    return this.save();
  }
}

AdvertisingContent.init({
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

  // Ad-Specific Fields
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Campaign',
      key: 'id'
    }
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 10
    }
  },

  // Play Requirements
  maxPlaysPerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  minMinutesBetweenPlays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: 1
    }
  },
  targetPlaysPerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },

  // Scheduling
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  playHourRestrictions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'Array of hours (0-23) when ad can play',
    validate: {
      isValidHours(value) {
        if (!Array.isArray(value)) {
          throw new Error('Play hours must be an array');
        }
        value.forEach(hour => {
          if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
            throw new Error('Invalid hour value');
          }
        });
      }
    }
  },

  // Vertical Targeting
  verticalRestrictions: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'Array of vertical IDs this ad is restricted to',
    validate: {
      isValidVerticals(value) {
        if (!Array.isArray(value)) {
          throw new Error('Vertical restrictions must be an array');
        }
      }
    }
  },

  // Tracking
  lastPlayedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  playCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'AdvertisingContent',
  tableName: 'advertising_contents',
  indexes: [
    { fields: ['campaignId'] },
    { fields: ['priority'] },
    { fields: ['lastPlayedAt'] },
    { fields: ['clientName'] }
  ],
  validate: {
    validateDates() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        throw new Error('End date must be after start date');
      }
    },
    validatePlayCounts() {
      if (this.targetPlaysPerDay && this.maxPlaysPerDay 
          && this.targetPlaysPerDay > this.maxPlaysPerDay) {
        throw new Error('Target plays cannot exceed maximum plays');
      }
    }
  }
});

// Define associations
AdvertisingContent.associate = (models) => {
  AdvertisingContent.belongsToMany(models.ContentLibrary, {
    through: 'AdvertisingContentLibrary',
    foreignKey: 'advertisingContentId'
  });
  
  AdvertisingContent.hasMany(models.PlaybackLog, {
    foreignKey: 'advertisingContentId'
  });

  AdvertisingContent.belongsTo(models.Campaign, {
    foreignKey: 'campaignId'
  });
};

module.exports = AdvertisingContent; 