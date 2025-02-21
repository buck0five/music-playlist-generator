// models/index.js

const sequelize = require('../config/database');
const { Op } = require('sequelize');

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
const ContentLibrary = require('./ContentLibrary');
const Vertical = require('./Vertical');
const User = require('./User');
const ContentLibraryContent = require('./ContentLibraryContent');


// If you have User.js / Vertical.js, you can import them too

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

// Station <-> ExcludedContent
Station.hasMany(StationExcludedContent, { foreignKey: 'stationId' });
StationExcludedContent.belongsTo(Station, { foreignKey: 'stationId' });

Content.hasMany(StationExcludedContent, { foreignKey: 'contentId' });
StationExcludedContent.belongsTo(Content, { foreignKey: 'contentId' });

// CART & CARTITEM
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'Content' });
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'CartItems' });

// CLOCK TEMPLATE & SLOT
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

// CLOCK MAP & SLOT
ClockMap.hasMany(ClockMapSlot, { foreignKey: 'clockMapId' });
ClockMapSlot.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
Station.belongsTo(ClockMap, { foreignKey: 'clockMapId' });
ClockMap.hasMany(Station, { foreignKey: 'clockMapId' });

// CONTENT LIBRARY <-> CONTENT
Content.belongsToMany(ContentLibrary, {
  through: ContentLibraryContent,
  foreignKey: 'contentId',
  otherKey: 'contentLibraryId',
  as: 'Libraries'
});
ContentLibrary.belongsToMany(Content, {
  through: ContentLibraryContent,
  foreignKey: 'contentLibraryId',
  otherKey: 'contentId',
  as: 'LibraryContents'
});

// Vertical associations
Vertical.hasMany(ContentLibrary, {
  foreignKey: 'verticalId',
  as: 'Libraries',
  scope: {
    libraryType: {
      [Op.in]: ['VERTICAL_MUSIC', 'VERTICAL_ADS']
    }
  }
});

ContentLibrary.belongsTo(Vertical, {
  foreignKey: 'verticalId',
  as: 'Vertical'
});

// User associations for station-specific libraries
User.hasMany(ContentLibrary, {
  foreignKey: 'userId',
  as: 'CustomLibraries',
  scope: {
    libraryType: 'STATION_CUSTOM'
  }
});

ContentLibrary.belongsTo(User, {
  foreignKey: 'userId',
  as: 'User'
});

// Add scoped associations for different library types
ContentLibrary.addScope('globalMusic', {
  where: {
    libraryType: 'GLOBAL_MUSIC',
    isGlobal: true
  }
});

ContentLibrary.addScope('verticalMusic', {
  where: {
    libraryType: 'VERTICAL_MUSIC'
  },
  include: [{
    model: Vertical,
    as: 'Vertical'
  }]
});

ContentLibrary.addScope('verticalAds', {
  where: {
    libraryType: 'VERTICAL_ADS',
    isAdLibrary: true
  },
  include: [{
    model: Vertical,
    as: 'Vertical'
  }]
});

ContentLibrary.addScope('stationCustom', {
  where: {
    libraryType: 'STATION_CUSTOM'
  },
  include: [{
    model: User,
    as: 'User'
  }]
});

// User associations
// If each station is "owned" by a user
User.hasMany(Station, { foreignKey: 'userId' });
Station.belongsTo(User, { foreignKey: 'userId' });

// Parent/child user relationships
User.hasMany(User, { as: 'children', foreignKey: 'parentUserId' });
User.belongsTo(User, { as: 'parentUser', foreignKey: 'parentUserId' });

// User content libraries
User.hasMany(ContentLibrary, { foreignKey: 'userId' });
ContentLibrary.belongsTo(User, { foreignKey: 'userId' });

// Export
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
  Vertical,
  User,
};
