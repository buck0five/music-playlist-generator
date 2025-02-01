// models/Company.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  platformId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Company;
