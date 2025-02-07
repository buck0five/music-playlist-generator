// models/ClockMapSlot.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ClockMapSlot extends Model {}

ClockMapSlot.init(
  {
    // 0=Sunday, 1=Monday,... or adapt to your preference
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // hour: 0..23
    hour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ClockMapSlot',
    freezeTableName: true,
  }
);

module.exports = ClockMapSlot;
