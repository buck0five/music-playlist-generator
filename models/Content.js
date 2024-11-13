// models/Content.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contentType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  tags: {
    type: DataTypes.STRING,
  },
});

module.exports = Content;
