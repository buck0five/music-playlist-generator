// models/ClockTemplate.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ClockTemplate = sequelize.define('ClockTemplate', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = ClockTemplate;
