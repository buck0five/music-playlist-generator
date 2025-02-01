// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// For simplicity, default to SQLite in development.
const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || 'database.sqlite',
    logging: false, // set to true for SQL debug logs
  }
);

module.exports = sequelize;
