// seed.js
const {
  sequelize,
  Format,
  Content,
  ContentType,
  Station,
  StationProfile,
  ClockTemplate,
  ClockTemplateSlot,
  Cart,
  CartItem,
  StationSchedule,
} = require('./models');

async function seed() {
  try {
    // 1. Force sync to recreate tables
    await sequelize.sync({ force: true });

    // 2. Create some Formats
    const rockFormat = await Format.create({ name: 'Rock' });
    const jazzFormat = await Format.create({ name: 'Jazz' });

    // 3. ContentTypes
    const songType = await ContentType.create({ name: 'Song' });
    const adType = await ContentType.create({ name: 'Ad' });

    // 4. Create a couple songs
    const song1 = await Content.create({
      title: 'Rock Anthem 1',
      contentType: 'song',
      fileName: 'rock_anthem_1.mp3',
      formatId: rockFormat.id,
      contentTypeId: songType.id,
      duration: 180,
    });
    const song2 = await Content.create({
      title: 'Smooth Jazz 1',
      contentType: 'song',
      fileName: 'smooth_jazz_1.mp3',
      formatId: jazzFormat.id,
      contentTypeId: songType.id,
      duration: 210,
    });

    // 5. Create a valid ad (no expiration)
    const ad1 = await Content.create({
      title: 'Car Dealership Ad',
      contentType: 'ad',
      fileName: 'car_dealership_ad.mp3',
      contentTypeId: adType.id,
      duration: 30,
      // no endDate => it never expires
    });

    // 6. Create an EXPIRED ad
    // Let's set endDate to a date in the past so it's invalid
    const expiredAd = await Content.create({
      title: 'Old Expired Ad',
      contentType: 'ad',
      fileName: 'old_ad.mp3',
      contentTypeId: adType.id,
      duration: 30,
      endDate: new Date('2020-01-01T00:00:00.000Z'), // definitely in the past
    });

    // 7. Create an Ad Cart
    const adCart = await Cart.create({
      cartName: 'Ad Cart',
      cartType: 'advertising',
    });

    // 8. Add BOTH ads to the Ad Cart (the valid one and the expired one)
    await CartItem.bulkCreate([
      {
        cartId: adCart.id,
        contentId: ad1.id, // valid ad
      },
      {
        cartId: adCart.id,
        contentId: expiredAd.id, // expired ad
      },
    ]);

    // 9. Create a ClockTemplate with 2 slots (song, then cart)
    const template1 = await ClockTemplate.create({
      templateName: 'Default Hour',
      description: 'Song at offset 0, ad cart at offset 15',
    });
    await ClockTemplateSlot.bulkCreate([
      {
        clockTemplateId: template1.id,
        minuteOffset: 0,
        slotType: 'song',
      },
      {
        clockTemplateId: template1.id,
        minuteOffset: 15,
        slotType: 'cart',
        cartId: adCart.id,
      },
    ]);

    // 10. Create Station #1
    const station1 = await Station.create({ name: 'Station #1' });
    await StationProfile.create({
      stationId: station1.id,
      storeHours: '9am-5pm',
      contactInfo: '555-1234',
    });

    // 11. Create a schedule so station #1 uses template1 for all hours (0..23)
    await StationSchedule.create({
      stationId: station1.id,
      clockTemplateId: template1.id,
      startHour: 0,
      endHour: 23,
    });

    console.log('Database synced and seeded with an expired ad.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
