// models/Format.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Format = sequelize.define('Format', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
});

// Export the model
module.exports = Format;
