// models/StationProfile.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StationProfile extends Model {}

StationProfile.init(
  {
    storeHours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dailyTransactionsEstimate: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'StationProfile',
    freezeTableName: true,
  }
);

module.exports = StationProfile;
