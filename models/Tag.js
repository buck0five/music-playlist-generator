// models/Tag.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Tag extends Model {}

Tag.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // each tag name is unique
    },
  },
  {
    sequelize,
    modelName: 'Tag',
    freezeTableName: true,
  }
);

module.exports = Tag;
