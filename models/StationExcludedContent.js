// models/StationExcludedContent.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StationExcludedContent extends Model {}

StationExcludedContent.init(
  {
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'StationExcludedContent',
    freezeTableName: true,
    indexes: [
      {
        unique: true,
        fields: ['stationId', 'contentId'],
      },
    ],
  }
);

module.exports = StationExcludedContent;
