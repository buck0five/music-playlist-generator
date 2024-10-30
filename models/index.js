// models/index.js

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const ClockTemplate = require('./ClockTemplate');
const ClockSegment = require('./ClockSegment');
const Cart = require('./Cart');
const ContentCart = require('./ContentCart'); // Import the join table model

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

// Content and Cart association (Many-to-Many)
Content.belongsToMany(Cart, { through: ContentCart, foreignKey: 'contentId', otherKey: 'cartId' });
Cart.belongsToMany(Content, { through: ContentCart, foreignKey: 'cartId', otherKey: 'contentId' });

module.exports = {
  sequelize,
  Sequelize,
  Format,
  Content,
  Feedback,
  ClockTemplate,
  ClockSegment,
  Cart,
  ContentCart, // Export if needed elsewhere
};
