// models/Content.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

class Content extends Model {
  /**
   * Find all libraries compatible with this content
   * @returns {Promise<ContentLibrary[]>} Array of compatible libraries
   */
  async findCompatibleLibraries() {
    const ContentLibrary = this.sequelize.models.ContentLibrary;
    const allLibraries = await ContentLibrary.findAll();
    
    const compatibleLibraries = [];
    for (const library of allLibraries) {
      const { isCompatible } = await library.isContentCompatible(this);
      if (isCompatible) {
        compatibleLibraries.push(library);
      }
    }
    
    return compatibleLibraries;
  }

  /**
   * Check if content is compatible with given library type
   * @param {string} libraryType - Type of library to check against
   * @returns {boolean} Whether content is compatible
   */
  isCompatibleWithLibraryType(libraryType) {
    switch (libraryType) {
      case 'GLOBAL_MUSIC':
        return !this.isAdvertisement && !this.verticalRestrictions?.length;
      case 'VERTICAL_MUSIC':
        return !this.isAdvertisement;
      case 'VERTICAL_ADS':
        return this.isAdvertisement;
      case 'STATION_CUSTOM':
        return true; // Station custom libraries can contain any content
      default:
        return false;
    }
  }

  /**
   * Assign content to multiple libraries with validation
   * @param {number[]} libraryIds - Array of library IDs to assign to
   * @returns {Promise<Object>} Results of assignment operation
   */
  async assignToLibraries(libraryIds) {
    const ContentLibrary = this.sequelize.models.ContentLibrary;
    return ContentLibrary.assignContentToLibraries(this.id, libraryIds);
  }

  /**
   * Update play statistics for this content
   * @param {number} stationId - ID of station that played the content
   * @returns {Promise<Content>} Updated content instance
   */
  async updatePlayStats(stationId) {
    this.lastPlayedAt = new Date();
    this.lastPlayedByStationId = stationId;
    this.playCount = (this.playCount || 0) + 1;
    
    // Create playback log entry
    await this.sequelize.models.PlaybackLog.create({
      contentId: this.id,
      stationId: stationId,
      playedAt: this.lastPlayedAt
    });

    return this.save();
  }

  /**
   * Get time elapsed since last play
   * @returns {number} Minutes since last play, or Infinity if never played
   */
  getTimeSinceLastPlay() {
    if (!this.lastPlayedAt) {
      return Infinity;
    }
    const now = new Date();
    const diffMs = now - this.lastPlayedAt;
    return Math.floor(diffMs / (1000 * 60)); // Convert to minutes
  }

  /**
   * Check if content is eligible for play based on timing rules
   * @param {number} stationId - ID of station checking eligibility
   * @returns {Promise<Object>} { isEligible: boolean, reason: string|null }
   */
  async isEligibleForPlay(stationId) {
    // Check if content is within its scheduled dates
    const now = new Date();
    if (this.startDate && this.startDate > now) {
      return { 
        isEligible: false, 
        reason: 'Content scheduled to start in the future' 
      };
    }
    if (this.endDate && this.endDate < now) {
      return { 
        isEligible: false, 
        reason: 'Content schedule has expired' 
      };
    }

    // Check daily hour restrictions
    const currentHour = now.getHours();
    if (this.dailyStartHour !== null && this.dailyEndHour !== null) {
      if (currentHour < this.dailyStartHour || currentHour > this.dailyEndHour) {
        return { 
          isEligible: false, 
          reason: 'Outside allowed hours of day' 
        };
      }
    }

    // Check last play time for this station
    const stationLastPlay = await this.sequelize.models.PlaybackLog.findOne({
      where: {
        contentId: this.id,
        stationId: stationId
      },
      order: [['playedAt', 'DESC']]
    });

    if (stationLastPlay) {
      const minsSinceLastPlay = Math.floor(
        (now - stationLastPlay.playedAt) / (1000 * 60)
      );
      
      // Default minimum 30 minutes between plays on same station
      const minSpacing = this.metadata.minPlaySpacing || 30;
      
      if (minsSinceLastPlay < minSpacing) {
        return { 
          isEligible: false, 
          reason: `Too soon since last play (${minsSinceLastPlay} mins ago)` 
        };
      }
    }

    return { isEligible: true, reason: null };
  }

  /**
   * Update score for a specific tag
   * @param {number} tagId - ID of the tag being scored
   * @param {number} score - Score value (-1 to 1)
   * @param {number} stationId - ID of station providing score
   * @returns {Promise<Content>} Updated content instance
   */
  async updateTagScore(tagId, score, stationId) {
    // Initialize tagScores if needed
    this.tagScores = this.tagScores || {};
    this.tagScores[tagId] = this.tagScores[tagId] || {
      total: 0,
      count: 0,
      byStation: {}
    };

    // Update station-specific score
    this.tagScores[tagId].byStation[stationId] = score;

    // Recalculate aggregate score
    const stationScores = Object.values(this.tagScores[tagId].byStation);
    this.tagScores[tagId].total = stationScores.reduce((sum, val) => sum + val, 0);
    this.tagScores[tagId].count = stationScores.length;

    // Create score history entry
    await this.sequelize.models.ContentTagScore.create({
      contentId: this.id,
      tagId: tagId,
      stationId: stationId,
      score: score,
      scoredAt: new Date()
    });

    return this.save();
  }

  /**
   * Get aggregate score for all tags from a specific station
   * @param {number} stationId - ID of station to get scores for
   * @returns {Object} Map of tagId to score
   */
  getAggregateTagScore(stationId) {
    const scores = {};
    
    // If no tag scores exist, return empty object
    if (!this.tagScores) {
      return scores;
    }

    // Calculate aggregate score for each tag
    for (const [tagId, data] of Object.entries(this.tagScores)) {
      // If station-specific score exists, use that
      if (data.byStation[stationId]) {
        scores[tagId] = data.byStation[stationId];
      } else {
        // Otherwise use average of all scores
        scores[tagId] = data.count > 0 ? data.total / data.count : 0;
      }
    }

    return scores;
  }

  /**
   * Get most popular tags for this content
   * @param {number} limit - Maximum number of tags to return
   * @returns {Array} Array of { tagId, score } sorted by score
   */
  getPopularTags(limit = 5) {
    if (!this.tagScores) {
      return [];
    }

    // Convert tag scores to array and calculate averages
    const tagScores = Object.entries(this.tagScores).map(([tagId, data]) => ({
      tagId: parseInt(tagId),
      score: data.count > 0 ? data.total / data.count : 0
    }));

    // Sort by score descending and limit results
    return tagScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

Content.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['song', 'advertisement', 'jingle', 'announcement', 'station_id']],
          msg: 'Invalid content type'
        }
      }
    },
    genres: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidGenres(value) {
          if (!Array.isArray(value)) {
            throw new Error('Genres must be an array');
          }
        }
      }
    },
    verticalRestrictions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of vertical IDs this content is restricted to',
      validate: {
        isValidVerticals(value) {
          if (!Array.isArray(value)) {
            throw new Error('Vertical restrictions must be an array');
          }
        }
      }
    },
    isAdvertisement: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dailyStartHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 23
      }
    },
    dailyEndHour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 23
      }
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0
      }
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      comment: 'Additional content properties and settings'
    },
    lastPlayedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When this content was last played'
    },
    playCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    lastPlayedByStationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Station',
        key: 'id'
      }
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidTags(value) {
          if (!Array.isArray(value)) {
            throw new Error('Tags must be an array');
          }
          // Validate tag structure if needed
          value.forEach(tag => {
            if (!tag.id || typeof tag.id !== 'number') {
              throw new Error('Each tag must have a valid numeric id');
            }
          });
        }
      }
    },
    tagScores: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      comment: 'Tag scoring history by station',
      validate: {
        isValidScores(value) {
          if (typeof value !== 'object') {
            throw new Error('Tag scores must be an object');
          }
          // Validate score structure if needed
          Object.values(value).forEach(tagData => {
            if (typeof tagData.total !== 'number' || 
                typeof tagData.count !== 'number' ||
                typeof tagData.byStation !== 'object') {
              throw new Error('Invalid tag score structure');
            }
          });
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Content',
    freezeTableName: true,
    validate: {
      validateScheduling() {
        if (this.startDate && this.endDate && this.startDate > this.endDate) {
          throw new Error('End date must be after start date');
        }
        if (this.dailyStartHour !== null && this.dailyEndHour !== null 
            && this.dailyStartHour > this.dailyEndHour) {
          throw new Error('Daily end hour must be after daily start hour');
        }
      }
    },
    indexes: [
      {
        fields: ['contentType']
      },
      {
        fields: ['isAdvertisement']
      },
      {
        fields: ['lastPlayedAt']
      },
      {
        fields: ['lastPlayedByStationId']
      }
    ]
  }
);

module.exports = Content;
