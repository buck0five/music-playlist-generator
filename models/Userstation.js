const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserStation = sequelize.define('UserStation', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserStation;
