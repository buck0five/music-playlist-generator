// models/Content.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Content extends Model {}

Content.init(
  {
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
    // any extra fields your repo has:
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

    // advanced scheduling fields if your repo has them:
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dailyStartHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dailyEndHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING,
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
