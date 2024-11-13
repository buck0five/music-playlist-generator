// models/Station.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Station = sequelize.define('Station', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Station;
