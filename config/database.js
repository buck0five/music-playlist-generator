// config/database.js

require('dotenv').config(); // Load environment variables

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: false, // Disable logging; set to true if you want to see SQL queries
});

module.exports = sequelize;
