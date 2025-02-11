// models/ContentLibraryContent.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContentLibraryContent extends Model {}

ContentLibraryContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contentLibraryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContentLibraryContent',
    freezeTableName: true,
  }
);

module.exports = ContentLibraryContent;
