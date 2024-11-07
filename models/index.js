// models/index.js

const Sequelize = require('sequelize');
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

// Associations

// Platform and Company
Platform.hasMany(Company, { foreignKey: 'platformId', as: 'Companies' });
Company.belongsTo(Platform, { foreignKey: 'platformId', as: 'Platform' });

// Company and Station
Company.hasMany(Station, { foreignKey: 'companyId', as: 'CompanyStations' });
Station.belongsTo(Company, { foreignKey: 'companyId', as: 'Company' });

// User and Station
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

// Content and ContentLibrary association
Content.belongsToMany(ContentLibrary, {
  through: 'ContentLibraryContent',
  as: 'AssociatedContentLibraries', // Changed alias to 'AssociatedContentLibraries'
  foreignKey: 'contentId',
});

ContentLibrary.belongsToMany(Content, {
  through: 'ContentLibraryContent',
  as: 'Contents',
  foreignKey: 'contentLibraryId',
});

// ContentLibraryAssignment associations
ContentLibrary.hasMany(ContentLibraryAssignment, {
  foreignKey: 'contentLibraryId',
  as: 'Assignments',
});
ContentLibraryAssignment.belongsTo(ContentLibrary, {
  foreignKey: 'contentLibraryId',
  as: 'ContentLibrary',
});

// Polymorphic Associations for ContentLibraryAssignment
ContentLibraryAssignment.belongsTo(Platform, {
  foreignKey: 'assignableId',
  constraints: false,
  as: 'Platform',
});
ContentLibraryAssignment.belongsTo(Company, {
  foreignKey: 'assignableId',
  constraints: false,
  as: 'Company',
});
ContentLibraryAssignment.belongsTo(Station, {
  foreignKey: 'assignableId',
  constraints: false,
  as: 'Station',
});

// ClockTemplate and ClockSegment
ClockTemplate.hasMany(ClockSegment, {
  foreignKey: 'clockTemplateId',
  as: 'Segments',
});
ClockSegment.belongsTo(ClockTemplate, {
  foreignKey: 'clockTemplateId',
  as: 'ClockTemplate',
});

// Export all models
module.exports = {
  sequelize,
  Sequelize,
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
