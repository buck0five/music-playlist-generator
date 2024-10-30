// models/Cart.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  type: {
    type: DataTypes.ENUM('song', 'ad', 'jingle', 'network_segment'),
    allowNull: false,
  },
});

module.exports = Cart;
