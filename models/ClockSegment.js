// models/ClockSegment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClockSegment = sequelize.define('ClockSegment', {
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ClockSegment;
