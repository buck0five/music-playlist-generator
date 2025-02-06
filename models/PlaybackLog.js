// models/PlaybackLog.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PlaybackLog extends Model {}

PlaybackLog.init(
  {
    stationId: { type: DataTypes.INTEGER, allowNull: false },
    contentId: { type: DataTypes.INTEGER, allowNull: false },
    playedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'PlaybackLog',
    freezeTableName: true,
  }
);

module.exports = PlaybackLog;
