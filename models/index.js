// models/index.js

const sequelize = require('../config/database');

const User = require('./User');
const Platform = require('./Platform');
const Company = require('./Company');
const Station = require('./Station');
const Content = require('./Content');
const ContentLibrary = require('./ContentLibrary');
const ContentLibraryAssignment = require('./ContentLibraryAssignment');
const ClockTemplate = require('./ClockTemplate');
const ClockSegment = require('./ClockSegment');

// Define associations

// User and Station (Many-to-Many)
User.belongsToMany(Station, {
  through: 'UserStations',
  as: 'AssignedStations',
  foreignKey: 'userId',
});
Station.belongsToMany(User, {
  through: 'UserStations',
  as: 'Users',
  foreignKey: 'stationId',
});

// Station and Company (Many-to-One)
Station.belongsTo(Company, {
  as: 'Company',
  foreignKey: 'companyId',
});
Company.hasMany(Station, {
  as: 'Stations',
  foreignKey: 'companyId',
});

// Company and Platform (Many-to-One)
Company.belongsTo(Platform, {
  as: 'Platform',
  foreignKey: 'platformId',
});
Platform.hasMany(Company, {
  as: 'Companies',
  foreignKey: 'platformId',
});

// ContentLibrary and Content (Many-to-Many)
Content.belongsToMany(ContentLibrary, {
  through: 'ContentLibraryContents',
  as: 'ContentLibraries',
  foreignKey: 'contentId',
});
ContentLibrary.belongsToMany(Content, {
  through: 'ContentLibraryContents',
  as: 'Contents',
  foreignKey: 'contentLibraryId',
});

// ContentLibraryAssignment
ContentLibraryAssignment.belongsTo(ContentLibrary, {
  as: 'ContentLibrary',
  foreignKey: 'contentLibraryId',
});

// ClockTemplate and ClockSegment (One-to-Many)
ClockTemplate.hasMany(ClockSegment, {
  as: 'Segments',
  foreignKey: 'clockTemplateId',
});
ClockSegment.belongsTo(ClockTemplate, {
  as: 'ClockTemplate',
  foreignKey: 'clockTemplateId',
});

module.exports = {
  sequelize,
  User,
  Platform,
  Company,
  Station,
  Content,
  ContentLibrary,
  ContentLibraryAssignment,
  ClockTemplate,
  ClockSegment,
};
