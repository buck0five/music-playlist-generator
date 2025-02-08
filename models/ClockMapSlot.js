// models/ClockMapSlot.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockMapSlot extends Model {}

ClockMapSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Must be an INTEGER column
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Must be an INTEGER column
    hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Optionally allow null for "no template"
    clockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ClockMapSlot',
    freezeTableName: true,
  }
);

module.exports = ClockMapSlot;
