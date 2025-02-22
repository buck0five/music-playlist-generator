// models/ContentLibraryContent.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * ContentLibraryContent Model
 * Join table between ContentLibrary and various content types
 * (music, advertising, station content)
 * @extends Model
 */
class ContentLibraryContent extends Model {}

ContentLibraryContent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Library reference
  contentLibraryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ContentLibrary',
      key: 'id'
    }
  },

  // Content type identifier
  contentType: {
    type: DataTypes.ENUM('MUSIC', 'ADVERTISING', 'STATION'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Content type is required'
      }
    }
  },

  // Optional content references - only one should be set
  musicContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'MusicContent',
      key: 'id'
    }
  },

  advertisingContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'AdvertisingContent',
      key: 'id'
    }
  },

  stationContentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'StationContent',
      key: 'id'
    }
  },

  // Metadata for the relationship
  addedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  addedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
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
    // Composite indexes for efficient lookups
    { fields: ['contentLibraryId', 'contentType'] },
    { fields: ['contentLibraryId', 'musicContentId'] },
    { fields: ['contentLibraryId', 'advertisingContentId'] },
    { fields: ['contentLibraryId', 'stationContentId'] }
  ],
  validate: {
    validateContentReference() {
      const contentIds = [
        this.musicContentId,
        this.advertisingContentId,
        this.stationContentId
      ].filter(id => id !== null);

      if (contentIds.length !== 1) {
        throw new Error('Exactly one content reference must be set');
      }

      // Validate content type matches reference
      switch (this.contentType) {
        case 'MUSIC':
          if (!this.musicContentId) {
            throw new Error('Music content type requires musicContentId');
          }
          break;
        case 'ADVERTISING':
          if (!this.advertisingContentId) {
            throw new Error('Advertising content type requires advertisingContentId');
          }
          break;
        case 'STATION':
          if (!this.stationContentId) {
            throw new Error('Station content type requires stationContentId');
          }
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

  ContentLibraryContent.belongsTo(models.StationContent, {
    foreignKey: 'stationContentId'
  });

  ContentLibraryContent.belongsTo(models.User, {
    foreignKey: 'addedBy',
    as: 'addedByUser'
  });
};

module.exports = ContentLibraryContent;
