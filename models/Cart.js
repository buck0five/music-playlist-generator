// models/Cart.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    // DB column "cartName" if your DB is already using that:
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cartName', // If your DB literally has "cartName"
    },
    // NEW: short code like "VEN1", "NET1", "THM1", etc.
    category: {
      type: DataTypes.STRING,
      allowNull: true, // or false if you want it mandatory
    },
    // Tie to a station. If you want a "global" cart, stationId can be NULL.
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false, // or true if you allow a global cart
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
