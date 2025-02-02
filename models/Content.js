// models/Content.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Content extends Model {}

Content.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // e.g., "song", "ad"
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'song',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 180, // 3 minutes
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'example.mp3',
    },
    // Start/end date for multi-day scheduling
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Time-of-day logic (0..23). If null => no restriction
    dailyStartHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dailyEndHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'public',
    },
  },
  {
    sequelize,
    modelName: 'Content',
    freezeTableName: true,
  }
);

module.exports = Content;
