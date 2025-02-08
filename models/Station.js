// models/Station.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Station extends Model {}

Station.init(
  {
    // Preserving fields from your repo
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // If you have a defaultClockTemplateId field:
    defaultClockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // If you have a clockMapId field:
    clockMapId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // NEW: references a vertical/segment
    verticalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // If you have userId for station manager:
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },

  },
  {
    sequelize,
    modelName: 'Station',
    freezeTableName: true,
  }
);

module.exports = Station;
