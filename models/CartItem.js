// models/CartItem.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    rotationWeight: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    freezeTableName: true,
  }
);

module.exports = CartItem;
