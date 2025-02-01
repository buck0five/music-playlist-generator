// models/ContentLibraryContent.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibraryContent = sequelize.define('ContentLibraryContent', {
  contentLibraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ContentLibraryContent;
