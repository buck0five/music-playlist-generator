// models/CartItem.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class CartItem extends Model {}

CartItem.init(
  {
    // You can store rotation weight or priority if desired
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
