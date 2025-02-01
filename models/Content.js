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
    // e.g., "song", "ad", "jingle"
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'song',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 180, // 3 min
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
    // For time-based logic (ads expiring, etc.)
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
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
