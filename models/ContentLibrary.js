// models/ContentLibrary.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContentLibrary extends Model {}

ContentLibrary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // e.g. "Global", "Hardware Ads", "Pet Store Music", etc.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // optional descriptive text
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // If you want a private user library
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // If you want a library tied to a vertical
    verticalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ContentLibrary',
    freezeTableName: true,
  }
);

module.exports = ContentLibrary;
