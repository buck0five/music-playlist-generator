// models/ClockSegment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ClockTemplate = require('./ClockTemplate');

const ClockSegment = sequelize.define('ClockSegment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clockTemplateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ClockTemplate,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.ENUM('song', 'ad', 'jingle', 'network_segment'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in seconds
    allowNull: false,
  },
});

module.exports = ClockSegment;
