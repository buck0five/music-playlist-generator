// models/Vertical.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Vertical extends Model {}

Vertical.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Vertical',
    freezeTableName: true,
  }
);

module.exports = Vertical;
