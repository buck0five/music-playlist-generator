// models/ClockMap.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockMap extends Model {}

ClockMap.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // e.g. "Weekly Schedule" 
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ClockMap',
    freezeTableName: true,
  }
);

module.exports = ClockMap;
