// models/ContentType.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContentType extends Model {}

ContentType.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContentType',
    freezeTableName: true,
  }
);

module.exports = ContentType;
