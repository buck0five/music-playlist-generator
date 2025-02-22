// models/ContentLibrary.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

/**
 * ContentLibrary Model
 * Represents a collection of content with type-specific handling
 * @extends Model
 */
class ContentLibrary extends Model {
  // Static methods for finding libraries
  static async findByType(type) {
    return this.findAll({
      where: { libraryType: type }
    });
  }

  static async findByVerticalWithContent(verticalId) {
    return this.findAll({
      where: { verticalId },
      include: ['Contents']  // Using the association name
    });
  }

  static async findGlobalMusicLibraries() {
    return this.findAll({
      where: {
        libraryType: 'GLOBAL_MUSIC',
        isGlobal: true
      }
    });
  }

  static async findVerticalAdLibraries(verticalId) {
    return this.findAll({
      where: {
        verticalId,
        libraryType: 'VERTICAL_ADS',
        isAdLibrary: true
      }
    });
  }

  /**
   * Check if content is compatible with this library
   * @param {MusicContent|AdvertisingContent|StationContent} content - Content to check
   * @returns {Promise<Object>} { isCompatible: boolean, reason: string|null }
   */
  async isContentCompatible(content) {
    // Check content model type compatibility
    const contentModelType = content.constructor.name;
    const allowedTypes = this.getAllowedContentModels();
    
    if (!allowedTypes.includes(contentModelType)) {
      return {
        isCompatible: false,
        reason: `Content type ${contentModelType} not allowed in ${this.libraryType} libraries`
      };
    }

    // Check vertical restrictions
    if (this.verticalId) {
      const verticalCheck = await this.checkVerticalCompatibility(content);
      if (!verticalCheck.isCompatible) return verticalCheck;
    }

    // Check library-specific restrictions
    const restrictionCheck = await this.checkLibraryRestrictions(content);
    if (!restrictionCheck.isCompatible) return restrictionCheck;

    return { isCompatible: true, reason: null };
  }

  /**
   * Get allowed content model types for this library
   * @returns {string[]} Array of allowed model names
   */
  getAllowedContentModels() {
    switch (this.libraryType) {
      case 'GLOBAL_MUSIC':
      case 'VERTICAL_MUSIC':
        return ['MusicContent'];
      case 'VERTICAL_ADS':
        return ['AdvertisingContent'];
      case 'STATION_CUSTOM':
        return ['MusicContent', 'AdvertisingContent', 'StationContent'];
      default:
        return [];
    }
  }

  /**
   * Check vertical compatibility
   * @param {Object} content - Content instance to check
   * @returns {Promise<Object>} { isCompatible: boolean, reason: string|null }
   */
  async checkVerticalCompatibility(content) {
    if (content.verticalRestrictions?.length) {
      if (!content.verticalRestrictions.includes(this.verticalId)) {
        return {
          isCompatible: false,
          reason: 'Content is not available for this vertical'
        };
      }
    }
    return { isCompatible: true, reason: null };
  }

  /**
   * Get content of specific type from library
   * @param {string} contentType - Type of content to fetch
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of content items
   */
  async getContentByType(contentType, options = {}) {
    const models = this.sequelize.models;
    const model = models[contentType];
    
    if (!model || !this.getAllowedContentModels().includes(contentType)) {
      throw new Error(`Invalid content type ${contentType} for library ${this.libraryType}`);
    }

    return model.findAll({
      include: [{
        model: this.constructor,
        where: { id: this.id }
      }],
      ...options
    });
  }

  /**
   * Mass assign content to multiple libraries with validation
   * @param {number} contentId - ID of content to assign
   * @param {number[]} libraryIds - Array of library IDs to assign to
   * @returns {Object} Results of assignment operation
   */
  static async assignContentToLibraries(contentId, libraryIds) {
    const results = {
      success: true,
      assigned: [],
      failed: [],
      errors: {}
    };

    // Validate content exists
    const content = await this.sequelize.models.Content.findByPk(contentId);
    if (!content) {
      return {
        success: false,
        error: 'Content not found'
      };
    }

    // Process each library
    for (const libId of libraryIds) {
      try {
        const library = await this.findByPk(libId);
        if (!library) {
          results.failed.push(libId);
          results.errors[libId] = 'Library not found';
          continue;
        }

        // Check compatibility
        const { isCompatible, reason } = await library.isContentCompatible(content);
        if (!isCompatible) {
          results.failed.push(libId);
          results.errors[libId] = reason;
          continue;
        }

        // Create association
        await this.sequelize.models.ContentLibraryContent.create({
          contentId,
          contentLibraryId: libId
        });

        results.assigned.push(libId);
      } catch (error) {
        results.failed.push(libId);
        results.errors[libId] = error.message;
      }
    }

    // Update overall success flag
    results.success = results.failed.length === 0;

    return results;
  }
}

ContentLibrary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // e.g. "Global", "Hardware Ads", "Pet Store Music", etc.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // optional descriptive text
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // If you want a private user library
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        async isValidUser(value) {
          if (this.libraryType === 'STATION_CUSTOM' && !value) {
            throw new Error('Station custom libraries must have a userId');
          }
          if (this.libraryType !== 'STATION_CUSTOM' && value) {
            throw new Error('Only station custom libraries can have a userId');
          }
        }
      }
    },

    // If you want a library tied to a vertical
    verticalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        async isValidVertical(value) {
          if (['VERTICAL_MUSIC', 'VERTICAL_ADS'].includes(this.libraryType) && !value) {
            throw new Error('Vertical-specific libraries must have a verticalId');
          }
          if (this.libraryType === 'GLOBAL_MUSIC' && value) {
            throw new Error('Global music libraries cannot have a verticalId');
          }
        }
      }
    },

    // New fields
    libraryType: {
      type: DataTypes.ENUM('GLOBAL_MUSIC', 'VERTICAL_MUSIC', 'VERTICAL_ADS', 'STATION_CUSTOM'),
      allowNull: false,
      validate: {
        isValidType(value) {
          const validTypes = ['GLOBAL_MUSIC', 'VERTICAL_MUSIC', 'VERTICAL_ADS', 'STATION_CUSTOM'];
          if (!validTypes.includes(value)) {
            throw new Error('Invalid library type');
          }
        }
      }
    },
    isAdLibrary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    adminOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Existing enhanced fields
    contentTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidContentTypes(value) {
          if (!Array.isArray(value)) {
            throw new Error('contentTypes must be an array');
          }
        }
      }
    },
    restrictions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      comment: 'Content restrictions and rules'
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      comment: 'Additional library properties and settings'
    },
    stationId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ContentLibrary',
    tableName: 'content_libraries',
    validate: {
      validateLibraryScope() {
        if (this.isGlobal && this.libraryType !== 'GLOBAL_MUSIC') {
          throw new Error('Only GLOBAL_MUSIC libraries can be marked as global');
        }
      }
    }
  }
);

// Define associations
ContentLibrary.associate = (models) => {
  // Many-to-many relationships with each content type
  ContentLibrary.belongsToMany(models.MusicContent, {
    through: 'LibraryMusicContent',
    foreignKey: 'libraryId',
    otherKey: 'musicContentId'
  });

  ContentLibrary.belongsToMany(models.AdvertisingContent, {
    through: 'LibraryAdvertisingContent',
    foreignKey: 'libraryId',
    otherKey: 'advertisingContentId'
  });

  ContentLibrary.belongsToMany(models.StationContent, {
    through: 'LibraryStationContent',
    foreignKey: 'libraryId',
    otherKey: 'stationContentId'
  });

  // Existing associations
  ContentLibrary.belongsTo(models.Vertical, {
    foreignKey: 'verticalId'
  });

  ContentLibrary.belongsTo(models.User, {
    foreignKey: 'userId'
  });
};

module.exports = ContentLibrary;
