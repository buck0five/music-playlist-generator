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
    // Link to a default clock template
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
