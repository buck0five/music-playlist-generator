// models/CartItem.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * CartItem Model
 * Represents an item in a cart with support for different content types
 * (music, advertising, station content)
 * @extends Model
 */
class CartItem extends Model {
  /**
   * Get the actual content instance regardless of type
   * @returns {Promise<MusicContent|AdvertisingContent|StationContent>}
   */
  async getContent() {
    const contentType = this.contentType;
    const models = this.sequelize.models;
    
    switch (contentType) {
      case 'MUSIC':
        return models.MusicContent.findByPk(this.musicContentId);
      case 'ADVERTISING':
        return models.AdvertisingContent.findByPk(this.advertisingContentId);
      case 'STATION':
        return models.StationContent.findByPk(this.stationContentId);
      default:
        throw new Error(`Invalid content type: ${contentType}`);
    }
  }

  /**
   * Check if this cart item is eligible to play
   * @param {number} stationId - Station ID to check against
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkPlayEligibility(stationId) {
    // Check scheduling rules first
    const scheduleCheck = await this.checkSchedulingRules();
    if (!scheduleCheck.canPlay) return scheduleCheck;

    // Get the content and check its eligibility
    const content = await this.getContent();
    if (!content) {
      return { canPlay: false, reason: 'Content not found' };
    }

    return content.checkPlayEligibility(stationId);
  }

  /**
   * Check if cart item is within its scheduled play period
   * @returns {Promise<Object>} { canPlay: boolean, reason: string|null }
   */
  async checkSchedulingRules() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();

    if (this.startDate && this.startDate > now) {
      return {
        canPlay: false,
        reason: 'Cart item scheduled to start in future'
      };
    }

    if (this.endDate && this.endDate < now) {
      return {
        canPlay: false,
        reason: 'Cart item schedule has expired'
      };
    }

    if (this.daysOfWeek?.length && !this.daysOfWeek.includes(currentDay)) {
      return {
        canPlay: false,
        reason: 'Not scheduled for current day'
      };
    }

    if (this.hoursOfDay?.length && !this.hoursOfDay.includes(currentHour)) {
      return {
        canPlay: false,
        reason: 'Not scheduled for current hour'
      };
    }

    return { canPlay: true, reason: null };
  }
}

CartItem.init({
  // Content Type Fields
  contentType: {
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content type is required'
      }
    }
  },
  musicContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'music_contents',
      key: 'id'
    }
  },
  advertisingContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'advertising_contents',
      key: 'id'
    }
  },
  stationContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'station_contents',
      key: 'id'
    }
  },

  // Cart Fields
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    }
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 100
    }
  },

  // Scheduling Fields
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  daysOfWeek: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'Array of days (0-6, Sunday is 0)',
    validate: {
      isValidDays(value) {
        if (value !== null) {
          if (!Array.isArray(value)) {
            throw new Error('Days must be an array');
          }
          value.forEach(day => {
            if (!Number.isInteger(day) || day < 0 || day > 6) {
              throw new Error('Invalid day value');
            }
          });
        }
      }
    }
  },
  hoursOfDay: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
    comment: 'Array of hours (0-23)',
    validate: {
      isValidHours(value) {
        if (value !== null) {
          if (!Array.isArray(value)) {
            throw new Error('Hours must be an array');
          }
          value.forEach(hour => {
            if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
              throw new Error('Invalid hour value');
            }
          });
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  indexes: [
    { fields: ['cartId'] },
    { fields: ['contentType'] },
    { fields: ['musicContentId'] },
    { fields: ['advertisingContentId'] },
    { fields: ['stationContentId'] }
  ],
  validate: {
    validateContentId() {
      const contentIds = [
        this.musicContentId,
        this.advertisingContentId,
        this.stationContentId
      ].filter(id => id !== null);

      if (contentIds.length !== 1) {
        throw new Error('Exactly one content ID must be set');
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
    },
    validateDates() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        throw new Error('End date must be after start date');
      }
    }
  }
});

// Define associations
CartItem.associate = (models) => {
  CartItem.belongsTo(models.Cart, {
    foreignKey: 'cartId'
  });

  CartItem.belongsTo(models.MusicContent, {
    foreignKey: 'musicContentId'
  });

  CartItem.belongsTo(models.AdvertisingContent, {
    foreignKey: 'advertisingContentId'
  });

  CartItem.belongsTo(models.StationContent, {
    foreignKey: 'stationContentId'
  });
};

module.exports = CartItem;
