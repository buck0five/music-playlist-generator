// models/User.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // e.g. store manager or chain manager
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // optional: "store", "chain", "admin"...
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'store', 
    },
    // if this user is a child of a "parent" user, references user.id
    parentUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
  }
);

module.exports = User;
