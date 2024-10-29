// models/index.js

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const ClockTemplate = require('./ClockTemplate');
const ClockSegment = require('./ClockSegment');

// Define associations

// Content and Format association
Content.belongsTo(Format, { foreignKey: 'formatId' });
Format.hasMany(Content, { foreignKey: 'formatId' });

// Feedback and Content association
Feedback.belongsTo(Content, { foreignKey: 'contentId' });
Content.hasMany(Feedback, { foreignKey: 'contentId' });

// ClockTemplate and Format association
ClockTemplate.belongsTo(Format, { foreignKey: 'formatId' });
Format.hasMany(ClockTemplate, { foreignKey: 'formatId' });

// ClockSegment and ClockTemplate association
ClockSegment.belongsTo(ClockTemplate, { foreignKey: 'clockTemplateId', as: 'ClockTemplate' });
ClockTemplate.hasMany(ClockSegment, { foreignKey: 'clockTemplateId', as: 'ClockSegments' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Sequelize,
  Format,
  Content,
  Feedback,
  ClockTemplate,
  ClockSegment,
};
