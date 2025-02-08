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
const Vertical = require('./Vertical'); // new import
const ContentLibrary = require('./ContentLibrary');

// OPTIONAL: If you have a User model or plan to add it
// const User = require('./User');

// ---------- STATION & PROFILES ----------
Station.hasMany(StationProfile, { foreignKey: 'stationId' });
StationProfile.belongsTo(Station, { foreignKey: 'stationId' });

// Station <-> StationSchedule
Station.hasMany(StationSchedule, { foreignKey: 'stationId' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId' });

// ---------- FORMAT & CONTENT ----------
Format.hasMany(Content, { foreignKey: 'formatId' });
Content.belongsTo(Format, { foreignKey: 'formatId' });

// ---------- CONTENTTYPE & CONTENT ----------
ContentType.hasMany(Content, { foreignKey: 'contentTypeId' });
Content.belongsTo(ContentType, { foreignKey: 'contentTypeId' });

// ---------- STATION & FEEDBACK ----------
Station.hasMany(Feedback, { foreignKey: 'stationId' });
Feedback.belongsTo(Station, { foreignKey: 'stationId' });

// ---------- CONTENT & FEEDBACK ----------
Content.hasMany(Feedback, { foreignKey: 'contentId' });
Feedback.belongsTo(Content, { foreignKey: 'contentId' });

// ---------- STATION EXCLUDED CONTENT ----------
Station.hasMany(StationExcludedContent, { foreignKey: 'stationId' });
StationExcludedContent.belongsTo(Station, { foreignKey: 'stationId' });

Content.hasMany(StationExcludedContent, { foreignKey: 'contentId' });
StationExcludedContent.belongsTo(Content, { foreignKey: 'contentId' });

// ---------- CART & CARTITEM, CONTENT ----------
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'Content' });
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'CartItems' });

// --------- Verticals and Libraries  ----------------
Vertical.hasMany(Station, { foreignKey: 'verticalId' });
Station.belongsTo(Vertical, { foreignKey: 'verticalId' });

Vertical.hasMany(ContentLibrary, { foreignKey: 'verticalId' });
ContentLibrary.belongsTo(Vertical, { foreignKey: 'verticalId' });

// ---------- CLOCK TEMPLATE & SLOT ----------
ClockTemplate.hasMany(ClockTemplateSlot, {
  foreignKey: 'clockTemplateId',
  as: 'slots',
});
ClockTemplateSlot.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'clockTemplate',
});

Cart.hasMany(ClockTemplateSlot, { foreignKey: 'cartId' });
ClockTemplateSlot.belongsTo(Cart, { foreignKey: 'cartId' });

// ---------- TAGGING ----------
ContentTag.belongsTo(Content, { foreignKey: 'contentId' });
ContentTag.belongsTo(Tag, { foreignKey: 'tagId' });
Content.hasMany(ContentTag, { foreignKey: 'contentId' });
Tag.hasMany(ContentTag, { foreignKey: 'tagId' });

StationTagPreference.belongsTo(Station, { foreignKey: 'stationId' });
StationTagPreference.belongsTo(Tag, { foreignKey: 'tagId' });
Station.hasMany(StationTagPreference, { foreignKey: 'stationId' });
Tag.hasMany(StationTagPreference, { foreignKey: 'tagId' });

// ---------- PLAYBACK LOG ----------
Station.hasMany(PlaybackLog, { foreignKey: 'stationId' });
PlaybackLog.belongsTo(Station, { foreignKey: 'stationId' });

Content.hasMany(PlaybackLog, { foreignKey: 'contentId' });
PlaybackLog.belongsTo(Content, { foreignKey: 'contentId' });

// ---------- CLOCK MAP, SLOT ----------
ClockMap.hasMany(ClockMapSlot, { foreignKey: 'clockMapId' });
ClockMapSlot.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
Station.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
ClockMap.hasMany(Station, { foreignKey: 'clockMapId' });

// ---------- CONTENT LIBRARY & CONTENT ----------
ContentLibrary.hasMany(Content, { foreignKey: 'libraryId' });
Content.belongsTo(ContentLibrary, { foreignKey: 'libraryId' });

// OPTIONAL: If you have a User model for private libraries
// User.hasMany(ContentLibrary, { foreignKey: 'userId' });
// ContentLibrary.belongsTo(User, { foreignKey: 'userId' });

// OPTIONAL: If you have a Vertical model for vertical-based libraries
// Vertical.hasMany(ContentLibrary, { foreignKey: 'verticalId' });
// ContentLibrary.belongsTo(Vertical, { foreignKey: 'verticalId' });

// ---------- EXPORTS ----------
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

  // OPTIONAL:
  // User,
  // Vertical,
};
