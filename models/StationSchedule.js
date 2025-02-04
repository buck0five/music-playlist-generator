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
    // dayOfWeek: integer 0=Sunday..6=Saturday, or use a string
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional if you want daily schedules
    },
    // Start time-of-day in 24-hour format (0..23)
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // End time-of-day in 24-hour format (0..23)
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 23,
    },
  },
  {
    sequelize,
    modelName: 'StationSchedule',
    freezeTableName: true,
  }
);

module.exports = StationSchedule;
