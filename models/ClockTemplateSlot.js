// models/ClockTemplateSlot.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockTemplateSlot extends Model {}

ClockTemplateSlot.init(
  {
    // The minute offset within the hour (e.g., 0, 15, 30)
    minuteOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // One of "song", "cart", etc.
    slotType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'song',
    },
    // The ID of the cart to use when slotType = 'cart'
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
