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
  ClockMap,
  ClockMapSlot,
} = require('./models');

async function seed() {
  try {
    // 1) Force sync (DROP all, recreate)
    await sequelize.sync({ force: true });

    // 2) Create a Station #1 (using default clock template)
    const station1 = await Station.create({
      name: 'Station #1',
      // defaultClockTemplateId: will set below once we create a clock template
      clockMapId: null, // not using clockMap for station #1 in this example
    });

    // 3) Create a second Station #2 that references a Clock Map (multi-day approach)
    const station2 = await Station.create({
      name: 'Station #2',
      // defaultClockTemplateId: null
      clockMapId: null, // we will set this after creating a clockMap
    });

    // 4) Create a Format
    const rockFormat = await Format.create({ name: 'Rock' });

    // 5) Create some Content: 2 songs, 2 ads
    const songA = await Content.create({
      title: 'Rock Anthem 1',
      contentType: 'song',
      formatId: rockFormat.id,
      duration: 180,
      score: 1.0,
      fileName: 'rock_anthem_1.mp3',
    });
    const songB = await Content.create({
      title: 'Rock Anthem 2',
      contentType: 'song',
      formatId: rockFormat.id,
      duration: 200,
      score: 1.0,
      fileName: 'rock_anthem_2.mp3',
    });
    const adA = await Content.create({
      title: 'Car Dealership Ad',
      contentType: 'ad',
      duration: 30,
      score: 1.0,
      fileName: 'car_ad.mp3',
    });
    const adB = await Content.create({
      title: 'Local Vendor Ad',
      contentType: 'ad',
      duration: 25,
      score: 1.0,
      fileName: 'vendor_ad.mp3',
    });

    // 6) Create a single ClockTemplate #1 for station #1
    const template1 = await ClockTemplate.create({
      templateName: 'Default Hour for Station #1',
      description: 'Song -> Cart -> Song example',
    });
    // Create 3 slots
    await ClockTemplateSlot.create({
      clockTemplateId: template1.id,
      slotType: 'song',
      minuteOffset: 0,
      cartId: null,
    });
    await ClockTemplateSlot.create({
      clockTemplateId: template1.id,
      slotType: 'cart',
      minuteOffset: 10,
      cartId: null, // will fill soon
    });
    await ClockTemplateSlot.create({
      clockTemplateId: template1.id,
      slotType: 'song',
      minuteOffset: 20,
      cartId: null,
    });

    // assign that to station1
    station1.defaultClockTemplateId = template1.id;
    await station1.save();

    // 7) Create a Cart for station #1 (e.g., "Vendor Cart")
    const cart1 = await Cart.create({
      name: 'Vendor Cart',
      category: 'VEN1',
      stationId: station1.id,
      rotationIndex: 0,
    });
    // Attach some ads
    await CartItem.create({ cartId: cart1.id, contentId: adA.id });
    await CartItem.create({ cartId: cart1.id, contentId: adB.id });

    // set the cartId in that second slot of template1
    const slotCart = await ClockTemplateSlot.findOne({
      where: { clockTemplateId: template1.id, minuteOffset: 10 },
    });
    slotCart.cartId = cart1.id;
    await slotCart.save();

    // 8) Create a ClockMap for station #2 (multi-day approach)
    const clockMap1 = await ClockMap.create({
      name: 'Weekday/Weekend Map',
      description: 'Assign different templates to different days/hours',
    });
    // for dayOfWeek=1 (Mon), hour=9 => clockTemplateId= template1 (just reusing)
    await ClockMapSlot.create({
      clockMapId: clockMap1.id,
      dayOfWeek: 1, // Monday
      hour: 9,
      clockTemplateId: template1.id,
    });
    // e.g. for dayOfWeek=2 (Tue), hour=9 => same template
    await ClockMapSlot.create({
      clockMapId: clockMap1.id,
      dayOfWeek: 2,
      hour: 9,
      clockTemplateId: template1.id,
    });

    // create a second clock template just to illustrate variety
    const template2 = await ClockTemplate.create({
      templateName: 'LateNight Template',
      description: '2 songs, 1 ad in between',
    });
    await ClockTemplateSlot.create({
      clockTemplateId: template2.id,
      slotType: 'song',
      minuteOffset: 0,
    });
    await ClockTemplateSlot.create({
      clockTemplateId: template2.id,
      slotType: 'cart',
      minuteOffset: 15,
    });
    await ClockTemplateSlot.create({
      clockTemplateId: template2.id,
      slotType: 'song',
      minuteOffset: 30,
    });

    // For dayOfWeek=1 (Mon), hour=23 => template2
    await ClockMapSlot.create({
      clockMapId: clockMap1.id,
      dayOfWeek: 1,
      hour: 23,
      clockTemplateId: template2.id,
    });

    // assign clockMap1 to station2
    station2.clockMapId = clockMap1.id;
    await station2.save();

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
