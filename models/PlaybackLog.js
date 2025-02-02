// models/PlaybackLog.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PlaybackLog extends Model {}

PlaybackLog.init(
  {
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // The time this item is scheduled or “logged” to play
    playedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Optional fields to store station’s dayOfWeek/hour
    // dayOfWeek: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    // hourOfDay: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    modelName: 'PlaybackLog',
    freezeTableName: true,
  }
);

module.exports = PlaybackLog;
