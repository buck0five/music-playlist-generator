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
    // Instead of a string like 'song','ad', etc. we can now link to ContentType via contentTypeId
    // But if you still want a quick reference, you can keep this:
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'song',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 180, // seconds
    },
    // Optional 'score' to help with feedback weighting
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    // A filename or path reference for the M3U
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'example.mp3',
    },

    // Start/end date for time-sensitive content (ads)
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Visibility or role-based access can be stored here
    visibility: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'public', // e.g. 'adminOnly'
    },
  },
  {
    sequelize,
    modelName: 'Content',
    freezeTableName: true,
  }
);

module.exports = Content;
