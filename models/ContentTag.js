// models/ContentTag.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContentTag extends Model {}

ContentTag.init(
  {
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ContentTag',
    freezeTableName: true,
  }
);

module.exports = ContentTag;
