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
  StationExcludedContent,
} = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });

    // 1. Create a Format
    const rockFormat = await Format.create({ name: 'Rock' });

    // 2. ContentTypes: Song, Ad
    const songType = await ContentType.create({ name: 'Song' });
    const adType = await ContentType.create({ name: 'Ad' });

    // 3. Create some Content
    const song1 = await Content.create({
      title: 'Rock Anthem 1',
      contentType: 'song',
      fileName: 'rock_anthem_1.mp3',
      formatId: rockFormat.id,
      contentTypeId: songType.id,
      duration: 180,
      dailyStartHour: 6, // example: only valid from 6 AM
      dailyEndHour: 22,  // to 10 PM
    });

    const song2 = await Content.create({
      title: 'Rock Anthem 2',
      contentType: 'song',
      fileName: 'rock_anthem_2.mp3',
      formatId: rockFormat.id,
      contentTypeId: songType.id,
      duration: 200,
      // no daily hour restriction
    });

    const ad1 = await Content.create({
      title: 'Car Dealership Ad',
      contentType: 'ad',
      fileName: 'car_dealership_ad.mp3',
      contentTypeId: adType.id,
      duration: 30,
      // Suppose it expires at end of year
      endDate: new Date('2025-12-31T23:59:59.999Z'),
    });

    // 4. Create a Cart for ads
    const adCart = await Cart.create({ cartName: 'Ad Cart', cartType: 'advertising' });
    await CartItem.create({
      cartId: adCart.id,
      contentId: ad1.id,
    });

    // 5. Create two clock templates
    const sundayTemplate = await ClockTemplate.create({
      templateName: 'Sunday Template',
      description: 'All songs, no ads',
    });
    await ClockTemplateSlot.bulkCreate([
      { clockTemplateId: sundayTemplate.id, minuteOffset: 0, slotType: 'song' },
      { clockTemplateId: sundayTemplate.id, minuteOffset: 15, slotType: 'song' },
    ]);

    const weekdayTemplate = await ClockTemplate.create({
      templateName: 'Weekday Template',
      description: 'Song at 0, Ad cart at 15',
    });
    await ClockTemplateSlot.bulkCreate([
      { clockTemplateId: weekdayTemplate.id, minuteOffset: 0, slotType: 'song' },
      { clockTemplateId: weekdayTemplate.id, minuteOffset: 15, slotType: 'cart', cartId: adCart.id },
    ]);

    // 6. Create Station #1
    const station1 = await Station.create({
      name: 'Station #1',
      // no defaultClockTemplateId => we'll rely on schedule
    });
    await StationProfile.create({
      stationId: station1.id,
      storeHours: '9am-5pm',
      contactInfo: '555-1234',
    });

    // 7. StationSchedule: Sunday => dayOfWeek=0 => Sunday Template
    await StationSchedule.create({
      stationId: station1.id,
      clockTemplateId: sundayTemplate.id,
      startHour: 0,
      endHour: 23,
      dayOfWeek: 0, // Sunday
    });
    // All other days => dayOfWeek=null => weekday template
    await StationSchedule.create({
      stationId: station1.id,
      clockTemplateId: weekdayTemplate.id,
      startHour: 0,
      endHour: 23,
      dayOfWeek: null,
    });

    // 8. (Optional) Exclude a piece of content for Station #1, e.g. "Rock Anthem 2"
    // StationExcludedContent.create({ stationId: station1.id, contentId: song2.id });

    console.log('Database synced and seeded successfully with day-of-week + time-of-day + exclude logic example.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
