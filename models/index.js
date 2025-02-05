// models/index.js

const sequelize = require('../config/database');

// ---------- MODEL IMPORTS ----------
// (Pulled from your repo, with added Cart & CartItem references)
const Station = require('./Station');
const StationProfile = require('./StationProfile');
const StationSchedule = require('./StationSchedule');
const Format = require('./Format');
const Content = require('./Content');
const Feedback = require('./Feedback');
const StationExcludedContent = require('./StationExcludedContent');
const ClockTemplate = require('./ClockTemplate');
const ContentType = require('./ContentType');
const Tag = require('./Tag');
const ContentTag = require('./ContentTag');
const StationTagPreference = require('./StationTagPreference');
const PlaybackLog = require('./PlaybackLog');
const ClockTemplateSlot = require('./ClockTemplateSlot');

// ---------- NEW CART MODELS -----------
const Cart = require('./Cart');
const CartItem = require('./CartItem');

// ---------- ASSOCIATIONS ----------

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

// ---------- CART & CARTITEM & CONTENT ----------
// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// CartItem <-> Content with alias "Content"
CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'Content' });
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'CartItems' });

// ---------- CLOCK TEMPLATE & SLOTS ----------
ClockTemplate.hasMany(ClockTemplateSlot, {
  foreignKey: 'clockTemplateId',
  as: 'slots',
});
ClockTemplateSlot.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'clockTemplate',
});

// If referencing cart in slots
Cart.hasMany(ClockTemplateSlot, { foreignKey: 'cartId' });
ClockTemplateSlot.belongsTo(Cart, { foreignKey: 'cartId' });

// ---------- TAGGING ----------
ContentTag.belongsTo(Content, { foreignKey: 'contentId' });
ContentTag.belongsTo(Tag, { foreignKey: 'tagId' });
Content.hasMany(ContentTag, { foreignKey: 'contentId' });
Tag.hasMany(ContentTag, { foreignKey: 'tagId' });

// StationTagPreference
StationTagPreference.belongsTo(Station, { foreignKey: 'stationId' });
StationTagPreference.belongsTo(Tag, { foreignKey: 'tagId' });
Station.hasMany(StationTagPreference, { foreignKey: 'stationId' });
Tag.hasMany(StationTagPreference, { foreignKey: 'tagId' });

// ---------- PLAYBACK LOG ----------
Station.hasMany(PlaybackLog, { foreignKey: 'stationId' });
PlaybackLog.belongsTo(Station, { foreignKey: 'stationId' });

Content.hasMany(PlaybackLog, { foreignKey: 'contentId' });
PlaybackLog.belongsTo(Content, { foreignKey: 'contentId' });

// ---------- EXPORT ALL ----------
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
  ContentType,
  Tag,
  ContentTag,
  StationTagPreference,
  PlaybackLog,
  ClockTemplateSlot,

  // NEW CART MODELS
  Cart,
  CartItem,
};
