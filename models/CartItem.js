// models/CartItem.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    // Typically no extra fields unless you want a "weight" or "priority"
    // If you need an ID, you can define { primaryKey: true, autoIncrement: true }
  },
  {
    sequelize,
    modelName: 'CartItem',
    freezeTableName: true,
  }
);

module.exports = CartItem;
