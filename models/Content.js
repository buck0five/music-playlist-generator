// models/Content.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Content extends Model {}

Content.init(
  {
    // Preserved from your repo:
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // If your repo had contentTypeId, keep it. Otherwise remove. 
    // This line was present in your older code, so let's preserve it:
    contentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    formatId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 1.0,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // NEW: link to ContentLibrary (if null => global)
    libraryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Content',
    freezeTableName: true,
  }
);

module.exports = Content;
