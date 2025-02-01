// models/Feedback.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Feedback extends Model {}

Feedback.init(
  {
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feedbackType: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Feedback',
    freezeTableName: true,
  }
);

module.exports = Feedback;
