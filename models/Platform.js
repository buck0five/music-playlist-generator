// models/Platform.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Platform = sequelize.define('Platform', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branding: {
    type: DataTypes.JSON, // For storing branding details like logos, colors
    allowNull: true,
  },
});

// No associations here

module.exports = Platform;
