const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Campaign extends Model {}

Campaign.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ACTIVE',
    validate: {
      isIn: [['ACTIVE', 'PAUSED', 'COMPLETED', 'SCHEDULED']]
    }
  }
}, {
  sequelize,
  modelName: 'Campaign',
  tableName: 'campaigns',
  timestamps: true,  // Add this line
  validate: {
    validateDates() {
      if (this.startDate && this.endDate && this.startDate > this.endDate) {
        throw new Error('End date must be after start date');
      }
    }
  }
});

// Add associations
Campaign.associate = (models) => {
  Campaign.hasMany(models.AdvertisingContent, {
    foreignKey: 'campaignId',
    as: 'advertisements'
  });
};

module.exports = Campaign;
