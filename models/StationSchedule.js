// models/StationSchedule.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StationSchedule extends Model {}

StationSchedule.init(
  {
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 23,
    },
    // New: dayOfWeek 0=Sunday,1=Monday,...6=Saturday
    // If null => applies to all days
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: 'StationSchedule',
    freezeTableName: true,
  }
);

module.exports = StationSchedule;
