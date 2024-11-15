// models/index.js

const sequelize = require('../config/database');

const User = require('./User');
const Platform = require('./Platform');
const Company = require('./Company');
const Station = require('./Station');
const ContentLibrary = require('./ContentLibrary');
const Content = require('./Content');
const ContentLibraryAssignment = require('./ContentLibraryAssignment');
const UserStation = require('./UserStation');

// Define associations

// User ↔ Station
User.belongsToMany(Station, {
  through: UserStation,
  as: 'Stations',
  foreignKey: 'userId',
});
Station.belongsToMany(User, {
  through: UserStation,
  as: 'Users',
  foreignKey: 'stationId',
});

// Content ↔ ContentLibrary
Content.belongsToMany(ContentLibrary, {
  through: 'ContentLibraryContent',
  as: 'ContentLibraries',
  foreignKey: 'contentId',
});
ContentLibrary.belongsToMany(Content, {
  through: 'ContentLibraryContent',
  as: 'Contents',
  foreignKey: 'contentLibraryId',
});

// ContentLibraryAssignment
ContentLibrary.hasMany(ContentLibraryAssignment, {
  foreignKey: 'contentLibraryId',
  as: 'Assignments',
});
ContentLibraryAssignment.belongsTo(ContentLibrary, {
  foreignKey: 'contentLibraryId',
  as: 'ContentLibrary',
});

// Company ↔ Platform
Company.belongsTo(Platform, { foreignKey: 'platformId', as: 'Platform' });
Platform.hasMany(Company, { foreignKey: 'platformId', as: 'Companies' });

// Station ↔ Company
Station.belongsTo(Company, { foreignKey: 'companyId', as: 'Company' });
Company.hasMany(Station, { foreignKey: 'companyId', as: 'Stations' });

// Export models
module.exports = {
  sequelize,
  User,
  Platform,
  Company,
  Station,
  ContentLibrary,
  Content,
  ContentLibraryAssignment,
  UserStation,
};
