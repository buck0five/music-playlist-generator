// models/CartItem.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    // Auto-increment primary key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Pivot fields
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // --- NEW SCHEDULING FIELDS ---
    // If null, no limit; otherwise must be >= startDate
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // If null, no limit; otherwise must be <= endDate
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Comma-separated dayOfWeek, e.g. "0,1,2" for Sun..Tue
    daysOfWeek: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // If not null, item is only valid after this hour in the day
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // If not null, item is invalid at or after this hour
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    freezeTableName: true,
  }
);

module.exports = CartItem;
