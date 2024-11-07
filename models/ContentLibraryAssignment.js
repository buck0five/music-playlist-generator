// models/ContentLibraryAssignment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentLibraryAssignment = sequelize.define(
  'ContentLibraryAssignment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contentLibraryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ContentLibraries',
        key: 'id',
      },
      allowNull: false,
    },
    assignableType: {
      type: DataTypes.ENUM('Platform', 'Company', 'Station'),
      allowNull: false,
    },
    assignableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ContentLibraryAssignment;
