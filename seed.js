// seed.js

const {
  sequelize,
  Format,
  Content,
  Feedback,
  ClockTemplate,
  ClockSegment,
  Cart,
} = require('./models');

(async () => {
  try {
    // Synchronize the database (drops and recreates tables)
    await sequelize.sync({ force: true });

    // Seed Formats
    const [rockFormat, jazzFormat] = await Promise.all([
      Format.create({ name: 'Rock', description: 'Rock music' }),
      Format.create({ name: 'Jazz', description: 'Jazz music' }),
    ]);

    console.log('Rock Format ID:', rockFormat.id);
    console.log('Jazz Format ID:', jazzFormat.id);

    // Seed Contents
    const contents = await Content.bulkCreate([
      {
        title: 'Rock Anthem',
        artist: 'The Rockers',
        duration: 300,
        file_path: '/path/to/rock-anthem.mp3',
        contentType: 'song',
        tags: 'energetic,guitar,drums',
        formatId: rockFormat.id,
        score: 0,
      },
      {
        title: 'Smooth Jazz',
        artist: 'Jazz Masters',
        duration: 240,
        file_path: '/path/to/smooth-jazz.mp3',
        contentType: 'song',
        tags: 'smooth,saxophone,relaxing',
        formatId: jazzFormat.id,
        score: 0,
      },
      {
        title: 'Ad: Buy One Get One Free',
        artist: null,
        duration: 30,
        file_path: '/path/to/ad1.mp3',
        contentType: 'ad',
        tags: 'promotion,sale',
        formatId: null,
        score: 0,
      },
      {
        title: 'Station Jingle',
        artist: null,
        duration: 15,
        file_path: '/path/to/jingle1.mp3',
        contentType: 'jingle',
        tags: 'station,branding',
        formatId: null,
        score: 0,
      },
      {
        title: 'News Update',
        artist: null,
        duration: 120,
        file_path: '/path/to/news.mp3',
        contentType: 'network_segment',
        tags: 'news,update',
        formatId: null,
        score: 0,
      },
    ]);

    // Seed Carts
    const [songCart, adCart, jingleCart] = await Promise.all([
      Cart.create({
        name: 'General Songs',
        description: 'All general songs',
        type: 'song',
      }),
      Cart.create({
        name: 'Advertisements',
        description: 'All ad content',
        type: 'ad',
      }),
      Cart.create({
        name: 'Jingles',
        description: 'Station jingles',
        type: 'jingle',
      }),
    ]);

    // Step 3.3: Associate Content with Carts
    // Retrieve content items
    const rockSong = await Content.findOne({ where: { title: 'Rock Anthem' } });
    const jazzSong = await Content.findOne({ where: { title: 'Smooth Jazz' } });
    const adContent = await Content.findOne({ where: { title: 'Ad: Buy One Get One Free' } });
    const jingleContent = await Content.findOne({ where: { title: 'Station Jingle' } });

    // Associate songs with songCart
    await songCart.addContents([rockSong, jazzSong]);

    // Associate ad with adCart
    await adCart.addContent(adContent);

    // Associate jingle with jingleCart
    await jingleCart.addContent(jingleContent);

    // Seed Clock Templates
    const defaultClockTemplate = await ClockTemplate.create({
      name: 'Default Clock',
      description: 'Standard clock template for all formats',
      formatId: null, // Set a formatId if you have format-specific templates
    });

    // Seed Clock Segments
    await ClockSegment.bulkCreate([
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 1,
        contentType: 'song',
        duration: 240, // 4 minutes
      },
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 2,
        contentType: 'ad',
        duration: 60, // 1 minute
      },
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 3,
        contentType: 'song',
        duration: 240,
      },
      {
        clockTemplateId: defaultClockTemplate.id,
        order: 4,
        contentType: 'jingle',
        duration: 30, // 30 seconds
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
