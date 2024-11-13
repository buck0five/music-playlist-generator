// models/ContentLibrary.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibrary = sequelize.define('ContentLibrary', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ContentLibrary;
