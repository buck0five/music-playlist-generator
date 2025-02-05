// models/Cart.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    // If your DB column is cartName, you can do:
    // name: { type: DataTypes.STRING, allowNull: false, field: 'cartName' }
    // Otherwise, here it’s simply “name”
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
