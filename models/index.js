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
const path = require('path');
const fs = require('fs');

// Already in your repo:
const CartItem = require('./CartItem');
const PlaybackLog = require('./PlaybackLog');

// NEW model for slot-based scheduling:
const ClockTemplateSlot = require('./ClockTemplateSlot');

// ----------------------------------------------------
// Associations
// ----------------------------------------------------

// Station <-> StationProfile
Station.hasMany(StationProfile, { foreignKey: 'stationId' });
StationProfile.belongsTo(Station, { foreignKey: 'stationId' });

// Station <-> StationSchedule
Station.hasMany(StationSchedule, { foreignKey: 'stationId' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId' });

// Format <-> Content
Format.hasMany(Content, { foreignKey: 'formatId' });
Content.belongsTo(Format, { foreignKey: 'formatId' });

// ContentType <-> Content
ContentType.hasMany(Content, { foreignKey: 'contentTypeId' });
Content.belongsTo(ContentType, { foreignKey: 'contentTypeId' });

// Station <-> Feedback
Station.hasMany(Feedback, { foreignKey: 'stationId' });
Feedback.belongsTo(Station, { foreignKey: 'stationId' });

// Content <-> Feedback
Content.hasMany(Feedback, { foreignKey: 'contentId' });
Feedback.belongsTo(Content, { foreignKey: 'contentId' });

// Station <-> StationExcludedContent
Station.hasMany(StationExcludedContent, { foreignKey: 'stationId' });
StationExcludedContent.belongsTo(Station, { foreignKey: 'stationId' });

// Content <-> StationExcludedContent
Content.hasMany(StationExcludedContent, { foreignKey: 'contentId' });
StationExcludedContent.belongsTo(Content, { foreignKey: 'contentId' });

// Cart <-> Content
Cart.hasMany(Content, { foreignKey: 'cartId' });
Content.belongsTo(Cart, { foreignKey: 'cartId' });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// PlaybackLog <-> Station
Station.hasMany(PlaybackLog, { foreignKey: 'stationId' });
PlaybackLog.belongsTo(Station, { foreignKey: 'stationId' });

// PlaybackLog <-> Content
Content.hasMany(PlaybackLog, { foreignKey: 'contentId' });
PlaybackLog.belongsTo(Content, { foreignKey: 'contentId' });

// ----------------------------------------------------
// FIX: ClockTemplate <-> ClockTemplateSlot with an alias
// If you want to include them as { model: ClockTemplateSlot, as: 'slots' }:
ClockTemplate.hasMany(ClockTemplateSlot, {
  foreignKey: 'clockTemplateId',
  as: 'slots', // define the alias here
});
ClockTemplateSlot.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'clockTemplate', // optional reverse alias
});

// If you want each slot to reference a Cart
Cart.hasMany(ClockTemplateSlot, { foreignKey: 'cartId' });
ClockTemplateSlot.belongsTo(Cart, { foreignKey: 'cartId' });

// ----------------------------------------------------
// Export all models
// ----------------------------------------------------
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
  // NEW
  ClockTemplateSlot,
};
