// models/index.js
const sequelize = require('../config/database');

// Import all models
const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const ContentType = require('./ContentType');
const Station = require('./Station');
const StationProfile = require('./StationProfile');
const ClockTemplate = require('./ClockTemplate');
const ClockTemplateSlot = require('./ClockTemplateSlot');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const StationSchedule = require('./StationSchedule');
const StationExcludedContent = require('./StationExcludedContent');
const PlaybackLog = require('./PlaybackLog');

// ------------- DEFINE ASSOCIATIONS -------------- //

// (A) Format <-> Content
Format.hasMany(Content, { foreignKey: 'formatId', as: 'contents' });
Content.belongsTo(Format, { foreignKey: 'formatId', as: 'format' });

// (B) ContentType <-> Content
ContentType.hasMany(Content, { foreignKey: 'contentTypeId', as: 'contentsOfType' });
Content.belongsTo(ContentType, { foreignKey: 'contentTypeId', as: 'contentTypeDef' });

// (C) Content <-> Feedback
Content.hasMany(Feedback, { foreignKey: 'contentId', as: 'feedbackEntries' });
Feedback.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

// (D) Station <-> StationProfile (One-to-One)
Station.hasOne(StationProfile, { foreignKey: 'stationId', as: 'profile' });
StationProfile.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });

// (E) ClockTemplate <-> ClockTemplateSlot
ClockTemplate.hasMany(ClockTemplateSlot, {
  foreignKey: 'clockTemplateId',
  as: 'slots',
});
ClockTemplateSlot.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'clockTemplate',
});

// (F) Cart <-> CartItem (One-to-Many)
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// (G) Content <-> CartItem (One-to-Many)
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'cartItems' });
CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

// (H) Station <-> StationSchedule (One-to-Many, for day-of-week scheduling)
Station.hasMany(StationSchedule, { foreignKey: 'stationId', as: 'schedules' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });

// (I) ClockTemplate <-> StationSchedule (One-to-Many)
ClockTemplate.hasMany(StationSchedule, { foreignKey: 'clockTemplateId', as: 'usedBySchedules' });
StationSchedule.belongsTo(ClockTemplate, { foreignKey: 'clockTemplateId', as: 'clockTemplate' });

// (J) StationExcludedContent (no direct association needed, but we can do station hasMany if you want)
StationExcludedContent.belongsTo(Station, { foreignKey: 'stationId' });
StationExcludedContent.belongsTo(Content, { foreignKey: 'contentId' });

// (K) PlaybackLog <-> Content <-> Station
PlaybackLog.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });
Content.hasMany(PlaybackLog, { foreignKey: 'contentId', as: 'playbackLogs' });

PlaybackLog.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });
Station.hasMany(PlaybackLog, { foreignKey: 'stationId', as: 'playbackLogs' });

// -------------- EXPORT ALL MODELS + SEQUELIZE -------------
module.exports = {
  sequelize,
  Format,
  Content,
  Feedback,
  ContentType,
  Station,
  StationProfile,
  ClockTemplate,
  ClockTemplateSlot,
  Cart,
  CartItem,
  StationSchedule,
  StationExcludedContent,
  PlaybackLog,
};
