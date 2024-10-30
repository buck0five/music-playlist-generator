// models/ContentCart.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentCart = sequelize.define('ContentCart', {
  contentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Contents',
      key: 'id',
    },
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Carts',
      key: 'id',
    },
    primaryKey: true,
  },
  // Add additional fields if necessary
}, {
  timestamps: false, // No need for createdAt/updatedAt in join table unless needed
});

module.exports = ContentCart;
