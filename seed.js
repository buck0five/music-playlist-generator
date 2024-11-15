// seed.js

const sequelize = require('./config/database');
const {
  User,
  Platform,
  Company,
  Station,
  ContentLibrary,
  Content,
  UserStation,
  ContentLibraryAssignment,
} = require('./models');

(async () => {
  try {
    // Drop all tables
    await sequelize.getQueryInterface().dropAllTables();
    console.log('All tables dropped.');

    // Sync the database
    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create an admin user with plain password
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword', // Plain password
      role: 'admin',
    });

    // Create a regular user with plain password
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'userpassword', // Plain password
      role: 'end_user',
    });

    // Create Platforms
    const platform = await Platform.create({ name: 'Default Platform' });

    // Create Companies
    const company = await Company.create({
      name: 'Default Company',
      platformId: platform.id,
    });

    // Create Stations
    const station1 = await Station.create({
      name: 'Station 1',
      companyId: company.id,
    });
    const station2 = await Station.create({
      name: 'Station 2',
      companyId: company.id,
    });

    // Assign stations to the regular user
    await regularUser.addStations([station1, station2]);

    // Create Content Libraries
    const contentLibrary1 = await ContentLibrary.create({
      name: 'Content Library 1',
    });
    const contentLibrary2 = await ContentLibrary.create({
      name: 'Content Library 2',
    });

    // Create Contents
    const content1 = await Content.create({
      title: 'Song 1',
      contentType: 'song',
      file_path: 'uploads/song1.mp3',
      duration: '3:30',
      tags: 'pop, upbeat',
    });

    const content2 = await Content.create({
      title: 'Ad 1',
      contentType: 'ad',
      file_path: 'uploads/ad1.mp3',
      duration: '0:30',
      tags: 'promotion, sale',
    });

    // Associate contents with content libraries
    await content1.addContentLibraries([contentLibrary1]);
    await content2.addContentLibraries([contentLibrary2]);

    // Assign content libraries to entities
    await ContentLibraryAssignment.create({
      contentLibraryId: contentLibrary1.id,
      assignableType: 'Station',
      assignableId: station1.id,
    });

    await ContentLibraryAssignment.create({
      contentLibraryId: contentLibrary2.id,
      assignableType: 'Company',
      assignableId: company.id,
    });

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})();
