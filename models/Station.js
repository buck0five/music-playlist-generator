// models/Station.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Station extends Model {}

Station.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // fallback default clock template if not covered by schedule
    defaultClockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Station',
    freezeTableName: true,
  }
);

module.exports = Station;
