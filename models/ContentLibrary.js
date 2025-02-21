// models/ContentLibrary.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

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
   * Checks if content is compatible with this library
   * @param {Object} content - Content instance to check
   * @returns {Object} { isCompatible: boolean, reason: string|null }
   */
  async isContentCompatible(content) {
    const error = await this.getCompatibilityError(content);
    return {
      isCompatible: !error,
      reason: error
    };
  }

  /**
   * Private helper to generate compatibility error messages
   * @param {Object} content - Content instance to check
   * @returns {string|null} Error message if incompatible, null if compatible
   */
  async getCompatibilityError(content) {
    // Check content type compatibility
    if (!this.contentTypes.includes(content.contentType)) {
      return `Content type "${content.contentType}" not allowed in this library`;
    }

    // Check ad content restrictions
    if (content.isAdvertisement && !this.isAdLibrary) {
      return 'Advertisement content can only be added to ad libraries';
    }
    if (!content.isAdvertisement && this.isAdLibrary) {
      return 'Only advertisement content can be added to ad libraries';
    }

    // Check vertical compatibility
    if (this.verticalId) {
      // For vertical-specific libraries, content must match vertical restrictions
      if (content.verticalId && content.verticalId !== this.verticalId) {
        return 'Content is restricted to a different vertical';
      }
    }

    // Check genre restrictions if defined
    if (this.restrictions.genres && content.genre) {
      if (this.restrictions.genres.excluded?.includes(content.genre)) {
        return `Genre "${content.genre}" is excluded from this library`;
      }
      if (this.restrictions.genres.allowed?.length > 0 
          && !this.restrictions.genres.allowed.includes(content.genre)) {
        return `Genre "${content.genre}" is not in allowed genres list`;
      }
    }

    // All checks passed
    return null;
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
      comment: 'Genre/format restrictions and rules'
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
  },
  {
    sequelize,
    modelName: 'ContentLibrary',
    freezeTableName: true,
    validate: {
      validateLibraryScope() {
        // Validate library type and scope combinations
        if (this.isAdLibrary && !['VERTICAL_ADS'].includes(this.libraryType)) {
          throw new Error('Ad libraries must be of type VERTICAL_ADS');
        }
        if (this.isGlobal && this.libraryType !== 'GLOBAL_MUSIC') {
          throw new Error('Only GLOBAL_MUSIC libraries can be marked as global');
        }
        if (this.adminOnly && !this.isGlobal) {
          throw new Error('Only global libraries can be admin-only');
        }
      }
    }
  }
);

module.exports = ContentLibrary;
