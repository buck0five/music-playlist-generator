// models/StationTagPreference.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StationTagPreference extends Model {}

StationTagPreference.init(
  {
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'StationTagPreference',
    freezeTableName: true,
  }
);

module.exports = StationTagPreference;
