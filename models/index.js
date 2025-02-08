// models/index.js

const sequelize = require('../config/database');

const Station = require('./Station');
const StationProfile = require('./StationProfile');
const StationSchedule = require('./StationSchedule');
const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const StationExcludedContent = require('./StationExcludedContent');
const ClockTemplate = require('./ClockTemplate');
const ClockTemplateSlot = require('./ClockTemplateSlot');
const ContentType = require('./ContentType');
const Tag = require('./Tag');
const ContentTag = require('./ContentTag');
const StationTagPreference = require('./StationTagPreference');
const PlaybackLog = require('./PlaybackLog');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const ClockMap = require('./ClockMap');
const ClockMapSlot = require('./ClockMapSlot');

// NEW: your ContentLibrary model
const ContentLibrary = require('./ContentLibrary');

// existing associations...

// STATION <-> PROFILES
Station.hasMany(StationProfile, { foreignKey: 'stationId' });
StationProfile.belongsTo(Station, { foreignKey: 'stationId' });

// STATION <-> SCHEDULE
Station.hasMany(StationSchedule, { foreignKey: 'stationId' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId' });

// FORMAT <-> CONTENT
Format.hasMany(Content, { foreignKey: 'formatId' });
Content.belongsTo(Format, { foreignKey: 'formatId' });

// CONTENTTYPE <-> CONTENT
ContentType.hasMany(Content, { foreignKey: 'contentTypeId' });
Content.belongsTo(ContentType, { foreignKey: 'contentTypeId' });

// STATION <-> FEEDBACK
Station.hasMany(Feedback, { foreignKey: 'stationId' });
Feedback.belongsTo(Station, { foreignKey: 'stationId' });

// CONTENT <-> FEEDBACK
Content.hasMany(Feedback, { foreignKey: 'contentId' });
Feedback.belongsTo(Content, { foreignKey: 'contentId' });

// STATION <-> EXCLUDEDCONTENT
Station.hasMany(StationExcludedContent, { foreignKey: 'stationId' });
StationExcludedContent.belongsTo(Station, { foreignKey: 'stationId' });

Content.hasMany(StationExcludedContent, { foreignKey: 'contentId' });
StationExcludedContent.belongsTo(Content, { foreignKey: 'contentId' });

// CARTS
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'Content' });
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'CartItems' });

// CLOCK TEMPLATES & SLOTS
ClockTemplate.hasMany(ClockTemplateSlot, { foreignKey: 'clockTemplateId', as: 'slots' });
ClockTemplateSlot.belongsTo(ClockTemplate, { foreignKey: 'clockTemplateId', as: 'clockTemplate' });

Cart.hasMany(ClockTemplateSlot, { foreignKey: 'cartId' });
ClockTemplateSlot.belongsTo(Cart, { foreignKey: 'cartId' });

// TAGGING
ContentTag.belongsTo(Content, { foreignKey: 'contentId' });
ContentTag.belongsTo(Tag, { foreignKey: 'tagId' });
Content.hasMany(ContentTag, { foreignKey: 'contentId' });
Tag.hasMany(ContentTag, { foreignKey: 'tagId' });

StationTagPreference.belongsTo(Station, { foreignKey: 'stationId' });
StationTagPreference.belongsTo(Tag, { foreignKey: 'tagId' });
Station.hasMany(StationTagPreference, { foreignKey: 'stationId' });
Tag.hasMany(StationTagPreference, { foreignKey: 'tagId' });

// PLAYBACK LOG
Station.hasMany(PlaybackLog, { foreignKey: 'stationId' });
PlaybackLog.belongsTo(Station, { foreignKey: 'stationId' });
Content.hasMany(PlaybackLog, { foreignKey: 'contentId' });
PlaybackLog.belongsTo(Content, { foreignKey: 'contentId' });

// CLOCK MAP
ClockMap.hasMany(ClockMapSlot, { foreignKey: 'clockMapId' });
ClockMapSlot.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
Station.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
ClockMap.hasMany(Station, { foreignKey: 'clockMapId' });

// -------- CONTENTLIBRARY <-> CONTENT --------
ContentLibrary.hasMany(Content, { foreignKey: 'libraryId' });
Content.belongsTo(ContentLibrary, { foreignKey: 'libraryId' });

// EXPORT
module.exports = {
  sequelize,
  Station,
  StationProfile,
  StationSchedule,
  Format,
  Content,
  Feedback,
  StationExcludedContent,
  ClockTemplate,
  ClockTemplateSlot,
  ContentType,
  Tag,
  ContentTag,
  StationTagPreference,
  PlaybackLog,
  Cart,
  CartItem,
  ClockMap,
  ClockMapSlot,
  ContentLibrary,
};
