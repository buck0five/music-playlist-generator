// models/Cart.js (final)
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cartName',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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
