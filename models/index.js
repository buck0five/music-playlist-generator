// models/index.js
const sequelize = require('../config/database');

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

// ---------- ASSOCIATIONS ---------- //

// Format <-> Content
Format.hasMany(Content, { foreignKey: 'formatId', as: 'contents' });
Content.belongsTo(Format, { foreignKey: 'formatId', as: 'format' });

// ContentType <-> Content
ContentType.hasMany(Content, { foreignKey: 'contentTypeId', as: 'contentsOfType' });
Content.belongsTo(ContentType, { foreignKey: 'contentTypeId', as: 'contentTypeDef' });

// Content <-> Feedback
Content.hasMany(Feedback, { foreignKey: 'contentId', as: 'feedbackEntries' });
Feedback.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

// Station <-> StationProfile (One-to-One)
Station.hasOne(StationProfile, { foreignKey: 'stationId', as: 'profile' });
StationProfile.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });

// ClockTemplate <-> ClockTemplateSlot
ClockTemplate.hasMany(ClockTemplateSlot, {
  foreignKey: 'clockTemplateId',
  as: 'slots',
});
ClockTemplateSlot.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'clockTemplate',
});

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// Content <-> CartItem (many-to-many via CartItem)
Content.hasMany(CartItem, { foreignKey: 'contentId', as: 'cartItems' });
CartItem.belongsTo(Content, { foreignKey: 'contentId', as: 'content' });

// Station <-> StationSchedule (One-to-Many)
Station.hasMany(StationSchedule, { foreignKey: 'stationId', as: 'schedules' });
StationSchedule.belongsTo(Station, { foreignKey: 'stationId', as: 'station' });

// ClockTemplate <-> StationSchedule (One-to-Many)
ClockTemplate.hasMany(StationSchedule, { foreignKey: 'clockTemplateId', as: 'usedBySchedules' });
StationSchedule.belongsTo(ClockTemplate, { foreignKey: 'clockTemplateId', as: 'clockTemplate' });

// ---------- EXPORT ----------
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
};
