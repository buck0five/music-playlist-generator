// models/StationTagPreference.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class StationTagPreference extends Model {
  /**
   * Calculate weighted score for a music content item
   * @param {MusicContent} musicContent 
   * @returns {Promise<number>} Score between 0-100
   */
  async calculateMusicScore(musicContent) {
    const contentTags = await musicContent.getTags();
    let totalScore = 0;
    let weightSum = 0;

    for (const tag of contentTags) {
      if (tag.tagType === 'MUSIC') {
        const preference = await this.findOne({
          where: { 
            stationId: this.stationId,
            tagId: tag.id
          }
        });
        
        if (preference) {
          totalScore += preference.score * preference.weight;
          weightSum += preference.weight;
        }
      }
    }

    return weightSum > 0 ? (totalScore / weightSum) : 50;
  }
}

StationTagPreference.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Station',
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Tag',
      key: 'id'
    }
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 50,
    validate: {
      min: 0,
      max: 100
    }
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 10
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isMusicPreference(value) {
        if (value.contentType && value.contentType !== 'MUSIC') {
          throw new Error('StationTagPreference can only be used with music content');
        }
      }
    }
  }
}, {
  sequelize,
  modelName: 'StationTagPreference',
  tableName: 'station_tag_preferences',
  indexes: [
    { fields: ['stationId'] },
    { fields: ['tagId'] },
    { unique: true, fields: ['stationId', 'tagId'] }
  ],
  validate: {
    async validateMusicTagType() {
      const tag = await this.sequelize.models.Tag.findByPk(this.tagId);
      if (tag && tag.tagType !== 'MUSIC' && tag.tagType !== 'GENERAL') {
        throw new Error('StationTagPreference can only reference music or general tags');
      }
    }
  }
});

// Define associations
StationTagPreference.associate = (models) => {
  StationTagPreference.belongsTo(models.Station, {
    foreignKey: 'stationId'
  });

  StationTagPreference.belongsTo(models.Tag, {
    foreignKey: 'tagId',
    scope: {
      tagType: ['MUSIC', 'GENERAL']
    }
  });
};

module.exports = StationTagPreference;
