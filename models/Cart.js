// models/Cart.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // merged fields from your repo:
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cartName', // if your DB column is cartName
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rotationIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // new association field
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: true, // or false if you want it required
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    freezeTableName: true,
  }
);

module.exports = Cart;
