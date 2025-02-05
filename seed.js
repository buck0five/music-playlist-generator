// seed.js

const { 
  sequelize, 
  Station,
  StationProfile,
  StationSchedule,
  Format,
  Content,
  Feedback,
  StationExcludedContent,
  ClockTemplate,
  ClockTemplateSlot,
  ContentType,
  Tag,
  ContentTag,
  StationTagPreference,
  PlaybackLog,
  Cart,
  CartItem,
} = require('./models');

async function seed() {
  try {
    // 1) Force a fresh sync, removing all old tables/data
    await sequelize.sync({ force: true });

    // 2) Create a Station
    const station1 = await Station.create({
      name: 'Station #1',
      // will assign defaultClockTemplateId after we create a ClockTemplate
    });

    // 3) Create a Format (optional) - e.g. "Rock" 
    const rockFormat = await Format.create({ name: 'Rock' });

    // 4) Create some Content
    // We'll make 2 songs, 2 ads
    const contentSongA = await Content.create({
      title: 'Rock Anthem 1',
      contentType: 'song',
      formatId: rockFormat.id,
      duration: 180,
      score: 1.0,
      fileName: 'rock_anthem_1.mp3',
    });

    const contentSongB = await Content.create({
      title: 'Rock Anthem 2',
      contentType: 'song',
      formatId: rockFormat.id,
      duration: 200,
      score: 1.0,
      fileName: 'rock_anthem_2.mp3',
    });

    const contentAdA = await Content.create({
      title: 'Car Dealership Ad',
      contentType: 'ad',
      duration: 30,
      score: 1.0,
      fileName: 'car_ad.mp3',
    });

    const contentAdB = await Content.create({
      title: 'Local Vendor Ad',
      contentType: 'ad',
      duration: 25,
      score: 1.0,
      fileName: 'vendor_ad.mp3',
    });

    // 5) Create a Cart for station #1 
    // Category e.g. "VEN1" means vendor ads
    const cartVendor = await Cart.create({
      name: 'Vendor Cart',
      category: 'VEN1',
      stationId: station1.id,
    });

    // 6) Attach some ad content to that cart
    await CartItem.create({ cartId: cartVendor.id, contentId: contentAdA.id });
    await CartItem.create({ cartId: cartVendor.id, contentId: contentAdB.id });

    // 7) Create a ClockTemplate
    const clockTemplate1 = await ClockTemplate.create({
      templateName: 'Basic Hour',
      description: 'Test clock with songs and ads',
    });

    // 8) Create a few ClockTemplateSlots referencing either "song" or the cart
    // For simplicity, we do something like: Song, then Cart, then Song
    await ClockTemplateSlot.create({
      clockTemplateId: clockTemplate1.id,
      slotType: 'song', 
      minuteOffset: 0, 
      // cartId: null since it's a direct "song"
    });
    // Second slot uses the vendor cart
    await ClockTemplateSlot.create({
      clockTemplateId: clockTemplate1.id,
      slotType: 'cart',
      minuteOffset: 5,
      cartId: cartVendor.id, // references the vendor cart
    });
    // Third slot another "song"
    await ClockTemplateSlot.create({
      clockTemplateId: clockTemplate1.id,
      slotType: 'song',
      minuteOffset: 10,
    });

    // 9) Assign that clock template as the station's default
    station1.defaultClockTemplateId = clockTemplate1.id;
    await station1.save();

    console.log('Seeding complete. Created station, format, content, cart, and a test clock template.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
