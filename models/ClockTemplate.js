// models/ClockTemplate.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Format = require('./Format');

const ClockTemplate = sequelize.define('ClockTemplate', {
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
  formatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Format,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
});

module.exports = ClockTemplate;
