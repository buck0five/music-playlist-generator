const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StationContent = sequelize.define('StationContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Add other necessary fields for station content
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentLibraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ContentLibrary',
      key: 'id'
    }
  },
  // Add any other fields specific to station content
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'station_content',
  timestamps: true
});

module.exports = StationContent;
