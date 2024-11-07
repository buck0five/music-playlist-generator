// models/UserPreferences.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const UserPreferences = sequelize.define('UserPreferences', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
    onDelete: 'CASCADE',
  },
  preferredFormats: {
    type: DataTypes.JSON, // Stores an array of format IDs
    allowNull: false,
  },
  // Add more preference fields as needed
});

module.exports = UserPreferences;
