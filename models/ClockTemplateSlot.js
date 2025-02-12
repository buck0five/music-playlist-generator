// models/ClockTemplateSlot.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockTemplateSlot extends Model {}

ClockTemplateSlot.init(
  {
    clockTemplateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slotType: {
      type: DataTypes.STRING,  // e.g. "music", "adCart", "jingle", "topHour"
      allowNull: false,
    },
    minuteOffset: {
      type: DataTypes.INTEGER, // 0..59
      allowNull: false,
      defaultValue: 0,
    },
    cartId: {
      type: DataTypes.INTEGER, // references the Cart table if you have one
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
