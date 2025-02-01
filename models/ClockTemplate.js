// models/ClockTemplate.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockTemplate extends Model {}

ClockTemplate.init(
  {
    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // If you want to assign a "type" or "description," add here
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ClockTemplate',
    freezeTableName: true,
  }
);

module.exports = ClockTemplate;
