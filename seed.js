// seed.js

const {
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
} = require('./models');

(async () => {
  try {
    await sequelize.sync({ force: true });

    // Seed Platforms
    const [mdRadio, toolTimeRadio] = await Promise.all([
      Platform.create({ name: 'MD Radio' }),
      Platform.create({ name: 'Tool Time Radio' }),
    ]);

    // Seed Companies
    const [bobsHardware, jimsHardware] = await Promise.all([
      Company.create({ name: "Bob's Hardware", platformId: toolTimeRadio.id }),
      Company.create({ name: "Jim's Hardware", platformId: toolTimeRadio.id }),
    ]);

    // Seed Stations
    const bobsStation = await Station.create({
      name: 'Bob Hardware Station 1',
      companyId: bobsHardware.id,
    });

    const jimsStations = await Promise.all([
      Station.create({ name: 'Jim Hardware Station 1', companyId: jimsHardware.id }),
      Station.create({ name: 'Jim Hardware Station 2', companyId: jimsHardware.id }),
      // Add more stations if needed
    ]);

    // Seed Users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
    });

    const bobUser = await User.create({
      username: 'bobmanager',
      email: 'bobmanager@example.com',
      password: 'bobpassword',
      role: 'end_user',
    });

    // Associate Bob's user with Bob's station
    await bobUser.addAssignedStations(bobsStation); // Updated method name

    // Seed Content Libraries
    const toolAdsLibrary = await ContentLibrary.create({ name: 'Tool Ads Library' });
    const toolMusicLibrary = await ContentLibrary.create({ name: 'Tool Music Library' });

    // Seed Contents
    const contents = await Content.bulkCreate([
      // Ads
      {
        title: 'Tool Sale Ad',
        contentType: 'ad',
        file_path: '/ads/tool-sale.mp3',
        duration: 30,
        tags: 'tools,sale',
      },
      // Music
      {
        title: 'Hardware Rock Song',
        contentType: 'song',
        file_path: '/music/hardware-rock.mp3',
        duration: 240,
        tags: 'rock,hardware',
      },
      // Add more content as needed
    ]);

    // Associate Content with Content Libraries
    const ads = contents.filter((c) => c.contentType === 'ad');
    const songs = contents.filter((c) => c.contentType === 'song');

    // Update association methods based on the new alias
    await Promise.all([
      toolAdsLibrary.addContents(ads),
      toolMusicLibrary.addContents(songs),
    ]);

    // Assign Content Libraries to Platforms
    await ContentLibraryAssignment.bulkCreate([
      {
        contentLibraryId: toolAdsLibrary.id,
        assignableType: 'Platform',
        assignableId: toolTimeRadio.id,
      },
      {
        contentLibraryId: toolMusicLibrary.id,
        assignableType: 'Platform',
        assignableId: toolTimeRadio.id,
      },
    ]);

    // Seed Clock Templates
    const defaultClockTemplate = await ClockTemplate.create({
      name: 'Default Clock',
      description: 'Standard clock template for all platforms',
      formatId: null,
    });

    // Seed Clock Segments
    await ClockSegment.bulkCreate([
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 1,
        contentType: 'song',
        duration: 240,
      },
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 2,
        contentType: 'ad',
        duration: 60,
      },
      // Add more segments as needed
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
})();
