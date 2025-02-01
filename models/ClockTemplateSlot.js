// models/ClockTemplateSlot.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockTemplateSlot extends Model {}

ClockTemplateSlot.init(
  {
    minuteOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    slotType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'song',
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ClockTemplateSlot',
    freezeTableName: true,
  }
);

module.exports = ClockTemplateSlot;
