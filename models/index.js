// models/index.js

const Station = require('./Station');
const StationProfile = require('./StationProfile');
const StationSchedule = require('./StationSchedule');
const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const StationExcludedContent = require('./StationExcludedContent');
const ClockTemplate = require('./ClockTemplate');
const Cart = require('./Cart');
const ContentType = require('./ContentType');
const sequelize = require('../config/database');

// Additional models you already have:
const CartItem = require('./CartItem');
const PlaybackLog = require('./PlaybackLog');
const ClockTemplateSlot = require('./ClockTemplateSlot');

// NEW models for advanced tagging
const Tag = require('./Tag');
const ContentTag = require('./ContentTag');
const StationTagPreference = require('./StationTagPreference');

// Existing associations (Stations, Schedules, etc.):
// ... (omitted for brevity) ...
// Keep them as is, e.g. Station <-> StationProfile, etc.

// Example: Cart -> CartItem, etc.

// ClockTemplate -> ClockTemplateSlot
ClockTemplate.hasMany(ClockTemplateSlot, { foreignKey: 'clockTemplateId', as: 'slots' });
ClockTemplateSlot.belongsTo(ClockTemplate, { foreignKey: 'clockTemplateId', as: 'clockTemplate' });

// If referencing cart in slots
Cart.hasMany(ClockTemplateSlot, { foreignKey: 'cartId' });
ClockTemplateSlot.belongsTo(Cart, { foreignKey: 'cartId' });

// ----------------------------------------------------
// Advanced Tagging Associations
// ----------------------------------------------------

// ContentTag is a pivot for Content <-> Tag
// We'll treat it as belongsTo for each side
ContentTag.belongsTo(Content, { foreignKey: 'contentId' });
ContentTag.belongsTo(Tag, { foreignKey: 'tagId' });

// If you want to do include: [Tag], you can define a "hasMany" from Content -> ContentTag
Content.hasMany(ContentTag, { foreignKey: 'contentId' });
Tag.hasMany(ContentTag, { foreignKey: 'tagId' });

// StationTagPreference
// We'll treat it similarly: stationId, tagId, score
StationTagPreference.belongsTo(Station, { foreignKey: 'stationId' });
StationTagPreference.belongsTo(Tag, { foreignKey: 'tagId' });

Station.hasMany(StationTagPreference, { foreignKey: 'stationId' });
Tag.hasMany(StationTagPreference, { foreignKey: 'tagId' });

// Export everything
module.exports = {
  Station,
  StationProfile,
  StationSchedule,
  Format,
  Content,
  Feedback,
  StationExcludedContent,
  ClockTemplate,
  Cart,
  ContentType,
  sequelize,
  CartItem,
  PlaybackLog,
  ClockTemplateSlot,
  // NEW:
  Tag,
  ContentTag,
  StationTagPreference,
};
