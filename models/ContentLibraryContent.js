const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ContentLibraryContent extends Model {}

ContentLibraryContent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  contentLibraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'content_libraries',  // Using table name instead of model name
      key: 'id'
    }
  },

  contentType: {
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content type is required'
      }
    }
  },

  musicContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'music_contents',  // Using table name instead of model name
      key: 'id'
    }
  },

  advertisingContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'advertising_contents',  // Using table name instead of model name
      key: 'id'
    }
  },

  // Keeping stationContentId but removing its reference constraint
  stationContentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  addedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ContentLibraryContent',
  tableName: 'content_library_contents',
  indexes: [
    { fields: ['contentLibraryId'] },
    { fields: ['contentType'] },
    { fields: ['musicContentId'] },
    { fields: ['advertisingContentId'] },
    { fields: ['stationContentId'] },
    { fields: ['contentLibraryId', 'contentType'] },
    { fields: ['contentLibraryId', 'musicContentId'] },
    { fields: ['contentLibraryId', 'advertisingContentId'] },
    { fields: ['contentLibraryId', 'stationContentId'] }
  ],
  validate: {
    validateContentReference() {
      // Only validate MUSIC and ADVERTISING types for now
      switch (this.contentType) {
        case 'MUSIC':
          if (!this.musicContentId) {
            throw new Error('Music content type requires musicContentId');
          }
          if (this.advertisingContentId || this.stationContentId) {
            throw new Error('Music content type cannot have other content IDs set');
          }
          break;
        case 'ADVERTISING':
          if (!this.advertisingContentId) {
            throw new Error('Advertising content type requires advertisingContentId');
          }
          if (this.musicContentId || this.stationContentId) {
            throw new Error('Advertising content type cannot have other content IDs set');
          }
          break;
        case 'STATION':
          // Skip validation for STATION type since it's not implemented yet
          break;
      }
    }
  }
});

// Define associations
ContentLibraryContent.associate = (models) => {
  ContentLibraryContent.belongsTo(models.ContentLibrary, {
    foreignKey: 'contentLibraryId'
  });

  ContentLibraryContent.belongsTo(models.MusicContent, {
    foreignKey: 'musicContentId'
  });

  ContentLibraryContent.belongsTo(models.AdvertisingContent, {
    foreignKey: 'advertisingContentId'
  });
};

module.exports = ContentLibraryContent;
