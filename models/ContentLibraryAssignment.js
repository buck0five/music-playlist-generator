// models/ContentLibraryAssignment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibraryAssignment = sequelize.define('ContentLibraryAssignment', {
  contentLibraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignableType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Platform', 'Company', 'Station']],
    },
  },
  assignableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ContentLibraryAssignment;
