// models/Cart.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    // Maps JS property "name" to DB column "cartName"
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cartName',
    },
    // Short code like "VEN1", "NET1", etc.
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Ties cart to a station
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Rotation index for round-robin picking
    rotationIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
