// models/Cart.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    cartName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cartType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
