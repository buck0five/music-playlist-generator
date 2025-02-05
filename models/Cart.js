// models/Cart.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    // The JS property "name" -> DB column "cartName"
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cartName',  // This ensures queries look for "cartName" in DB
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
