const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class StationContent extends Model {}

StationContent.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentType: {
    type: DataTypes.ENUM('STATION_ID', 'JINGLE', 'ANNOUNCEMENT', 'WEATHER', 'TIME_CHECK'),
    allowNull: false
  },
  stationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Stations',
      key: 'id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cartType: {
    type: DataTypes.ENUM('SID1', 'JIN1', 'ANN1', 'WEA1', 'TIM1'),
    allowNull: false
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringInterval: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'StationContent',
  timestamps: true
});

module.exports = StationContent;