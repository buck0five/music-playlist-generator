// models/Content.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Format = require('./Format');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false, // Ensure 'id' cannot be NULL
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artist: DataTypes.STRING,
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.ENUM('song', 'ad', 'jingle', 'network_segment'),
    allowNull: false,
  },
  tags: DataTypes.STRING,
  formatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Format,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = Content;
