// models/ContentLibrary.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibrary = sequelize.define('ContentLibrary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other attributes if needed
});

// No associations here; they are defined in models/index.js

module.exports = ContentLibrary;
