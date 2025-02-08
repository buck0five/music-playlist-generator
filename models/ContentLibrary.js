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

    // e.g. "Global Library", "Hardware Ads", "Pet Store Music", etc.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // optional description
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // set this if the library is private to a certain user
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // set this if the library is segment/vertical-based (if you have a 'Vertical.js' or 'Segment.js')
    // can remain null for user-based or global
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
