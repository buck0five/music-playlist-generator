// models/Tag.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Tag extends Model {}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  tagType: {
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION', 'GENERAL'),
    allowNull: false,
    defaultValue: 'GENERAL',
    comment: 'Type of content this tag is primarily used for'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidMetadata(value) {
        if (typeof value !== 'object') {
          throw new Error('Metadata must be an object');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tags',
  indexes: [
    { fields: ['tagType'] },
    { fields: ['name'] }
  ]
});

module.exports = Tag;
