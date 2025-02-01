// models/Format.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Format extends Model {}

Format.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Format',
    freezeTableName: true,
  }
);

module.exports = Format;
