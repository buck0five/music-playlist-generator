// seed.js
const {
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
  CartItem
} = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Destroys old tables, recreates new

    // 1) Create some Formats
    const rockFormat = await Format.create({ name: 'Rock' });
    const jazzFormat = await Format.create({ name: 'Jazz' });

    // 2) Create ContentTypes
    const songType = await ContentType.create({ name: 'Song' });
    const adType = await ContentType.create({ name: 'Ad' });

    // 3) Create multiple songs (12 songs, each 180 seconds)
    // We'll alternate between 'Rock' and 'Jazz' format for demonstration
    const songsToCreate = [];
    for (let i = 1; i <= 12; i++) {
      songsToCreate.push({
        title: `Song #${i}`,
        contentType: 'song',
        formatId: i % 2 === 0 ? jazzFormat.id : rockFormat.id,
        duration: 180,
        score: 1.0,
        fileName: `song_${i}.mp3`,
        contentTypeId: songType.id
      });
    }
    await Content.bulkCreate(songsToCreate);

    // 4) Create 2 ads
    const ad1 = await Content.create({
      title: 'Car Dealership Ad',
      contentType: 'ad',
      duration: 30,
      score: 1.0,
      fileName: 'car_dealership_ad.mp3',
      contentTypeId: adType.id
    });
    const ad2 = await Content.create({
      title: 'Insurance Ad',
      contentType: 'ad',
      duration: 30,
      score: 1.0,
      fileName: 'insurance_ad.mp3',
      contentTypeId: adType.id
    });

    // 5) Create a Cart for ads
    const adCart = await Cart.create({
      cartName: 'Ad Cart',
      cartType: 'advertising'
    });

    // 6) Link the 2 ads to the Ad Cart
    await CartItem.bulkCreate([
      {
        cartId: adCart.id,
        contentId: ad1.id,
        rotationWeight: 1.0
      },
      {
        cartId: adCart.id,
        contentId: ad2.id,
        rotationWeight: 1.0
      }
    ]);

    // 7) Create a Clock Template with 6 slots in an hour
    // E.g. Song @ 0, Song @ 10, Cart @ 20, Song @ 30, Song @ 40, Cart @ 50
    // This is just an example distribution
    const clockTemplate = await ClockTemplate.create({
      templateName: '1-Hour Template',
      description: '4 songs, 2 ads'
    });

    await ClockTemplateSlot.bulkCreate([
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 0,
        slotType: 'song'
      },
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 10,
        slotType: 'song'
      },
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 20,
        slotType: 'cart',
        cartId: adCart.id
      },
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 30,
        slotType: 'song'
      },
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 40,
        slotType: 'song'
      },
      {
        clockTemplateId: clockTemplate.id,
        minuteOffset: 50,
        slotType: 'cart',
        cartId: adCart.id
      }
    ]);

    // 8) Create Station #1 and assign the clock template
    const station1 = await Station.create({
      name: 'Station #1',
      defaultClockTemplateId: clockTemplate.id
    });

    await StationProfile.create({
      stationId: station1.id,
      storeHours: '9am-5pm',
      contactInfo: '555-1234',
      dailyTransactionsEstimate: 100
    });

    // 9) Create Station #2 (no default clock template)
    const station2 = await Station.create({
      name: 'Station #2'
    });

    console.log('Database synced and seeded successfully.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
