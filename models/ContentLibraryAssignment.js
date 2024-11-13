// models/ContentLibraryAssignment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibraryAssignment = sequelize.define('ContentLibraryAssignment', {
  assignableType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = ContentLibraryAssignment;
