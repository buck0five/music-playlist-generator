// seed.js

const {
  sequelize,
  // Models
  User,
  Vertical,
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
  ContentLibrary,
} = require('./models');

async function seed() {
  try {
    // Force sync to drop & recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    // ========== 1) Create Some Users ==========
    // user #1: top-level admin
    const adminUser = await User.create({
      name: 'Alice Admin',
      email: 'alice@admin.com',
      role: 'admin',
      parentUserId: null,
    });

    // user #2: multi-store "chain" user (no parent)
    const chainUser = await User.create({
      name: 'Bob ChainUser',
      email: 'bob@chain.com',
      role: 'chain',
      parentUserId: null,
    });

    // user #3: store user, child of the chain user
    const storeUser1 = await User.create({
      name: 'Carol StoreUser1',
      email: 'carol@store.com',
      role: 'store',
      parentUserId: chainUser.id,
    });

    // user #4: another store user, same chain
    const storeUser2 = await User.create({
      name: 'Dan StoreUser2',
      email: 'dan@store.com',
      role: 'store',
      parentUserId: chainUser.id,
    });

    // ========== 2) Create Some Verticals ==========
    const petVertical = await Vertical.create({
      name: 'Pet Stores',
      description: 'All pet store stations and content',
    });
    const hardwareVertical = await Vertical.create({
      name: 'Hardware Stores',
      description: 'All hardware store stations and content',
    });

    // ========== 3) Create Some Stations ==========
    // Station #1 belongs to storeUser1, uses petVertical
    const station1 = await Station.create({
      name: 'Station #1 (Pet)',
      userId: storeUser1.id,
      verticalId: petVertical.id,
      defaultClockTemplateId: null, // or set to some ID later
      clockMapId: null,
    });

    // Station #2 belongs to storeUser2, uses hardwareVertical
    const station2 = await Station.create({
      name: 'Station #2 (Hardware)',
      userId: storeUser2.id,
      verticalId: hardwareVertical.id,
      defaultClockTemplateId: null,
      clockMapId: null,
    });

    // ========== 4) Create Some Content Libraries ==========
    // library #1: global music library (no userId, no verticalId)
    const globalMusicLib = await ContentLibrary.create({
      name: 'Global Music Library',
      description: 'System-wide music collection',
      libraryType: 'GLOBAL_MUSIC',
      isGlobal: true,
      adminOnly: true,
      contentTypes: ['song'],
      restrictions: {
        genres: {
          included: ['pop', 'rock', 'jazz'],
          excluded: ['explicit']
        }
      }
    });

    // library #2: pet vertical library
    const petMusicLib = await ContentLibrary.create({
      name: 'Pet Store Music',
      description: 'Vertical-specific music for pet stores',
      libraryType: 'VERTICAL_MUSIC',
      verticalId: petVertical.id,
      contentTypes: ['song'],
      restrictions: {
        genres: {
          included: ['ambient', 'relaxing']
        }
      }
    });

    // library #3: hardware vertical library
    const hardwareLib = await ContentLibrary.create({
      name: 'Hardware Store Ads',
      description: 'Ads only for hardware stores',
      userId: null,
      verticalId: hardwareVertical.id,
      libraryType: 'VERTICAL_ADS',
      isAdLibrary: true,
      contentTypes: ['advertisement']
    });

    // library #4: private library for storeUser1
    const user1Lib = await ContentLibrary.create({
      name: 'User1 Private Library',
      description: 'StoreUser1 custom audio',
      userId: storeUser1.id,
      verticalId: null,
      libraryType: 'STATION_CUSTOM',
      contentTypes: ['song', 'jingle']
    });

    // library #5: pet ads library
    const petAdsLib = await ContentLibrary.create({
      name: 'Pet Store Ads',
      description: 'Pet store advertisements',
      libraryType: 'VERTICAL_ADS',
      verticalId: petVertical.id,
      isAdLibrary: true,
      contentTypes: ['advertisement']
    });

    // ========== 5) Create Some Content ==========
    // some global music (libraryId = globalMusicLib)
    const globalSongA = await Content.create({
      title: 'Global Rock Song 1',
      contentType: 'song',
      duration: 180,
      fileName: 'global_rock_1.mp3',
      score: 1.0,
      genres: ['rock'],
      verticalRestrictions: [],
      tags: []
    });
    await globalMusicLib.addLibraryContent(globalSongA);
    const globalSongB = await Content.create({
      title: 'Global Rock Song 2',
      contentType: 'song',
      libraryId: globalMusicLib.id,
      duration: 200,
      fileName: 'global_rock_2.mp3',
      score: 1.0,
    });

    // pet store ads
    const petAd1 = await Content.create({
      title: 'Pet Store Ad #1',
      contentType: 'advertisement',
      isAdvertisement: true,
      libraryId: petMusicLib.id,
      duration: 30,
      fileName: 'pet_ad_1.mp3',
      score: 1.0,
      genres: [],
      verticalRestrictions: [petVertical.id],
      tags: []
    });
    await petMusicLib.addLibraryContent(petAd1);

    // hardware store ads
    const hardwareAd1 = await Content.create({
      title: 'Hardware Ad #1',
      contentType: 'advertisement',
      isAdvertisement: true,
      libraryId: hardwareLib.id,
      duration: 25,
      fileName: 'hardware_ad_1.mp3',
      score: 1.0,
      genres: [],
      verticalRestrictions: [hardwareVertical.id],
      tags: []
    });
    await hardwareLib.addLibraryContent(hardwareAd1);

    // private content for user1
    const user1ContentA = await Content.create({
      title: 'User1 Custom Jingle',
      contentType: 'jingle',
      libraryId: user1Lib.id,
      duration: 15,
      fileName: 'user1_jingle.mp3',
      score: 1.0,
    });
    await user1Lib.addLibraryContent(user1ContentA);

    // ========== 6) Create a Cart for station1, referencing user1's station ==========
    const station1CartA = await Cart.create({
      name: 'Station1 Ad Cart',
      category: 'ADS',
      stationId: station1.id, // belongs to station #1
      rotationIndex: 0,
    });

    // Add cart items referencing petAd1 and user1ContentA
    await CartItem.create({
      cartId: station1CartA.id,
      contentId: petAd1.id, // from library #2
    });
    await CartItem.create({
      cartId: station1CartA.id,
      contentId: user1ContentA.id, // from user1's private lib
    });

    // ========== 7) Optionally create a Cart for station2, referencing hardwareAd1 ==========
    const station2Cart = await Cart.create({
      name: 'Station2 Ad Cart',
      category: 'ADS',
      stationId: station2.id,
      rotationIndex: 0,
    });
    await CartItem.create({
      cartId: station2Cart.id,
      contentId: hardwareAd1.id,
    });

    // ========== 8) Create some tags ==========
    const tags = await Promise.all([
      Tag.create({ name: 'Upbeat' }),
      Tag.create({ name: 'Relaxing' }),
      Tag.create({ name: 'Sale' }),
      Tag.create({ name: 'Promotional' })
    ]);

    // ========== 9) Create content with tags ==========
    const globalSong = await Content.create({
      title: 'Happy Days',
      contentType: 'song',
      genres: ['pop', 'upbeat'],
      duration: 180,
      fileName: 'happy_days.mp3',
      tags: [{ id: tags[0].id }], // Upbeat tag
      tagScores: {
        [tags[0].id]: {
          total: 4.5,
          count: 5,
          byStation: {}
        }
      }
    });

    const petAd = await Content.create({
      title: 'Summer Pet Sale',
      contentType: 'advertisement',
      isAdvertisement: true,
      duration: 30,
      fileName: 'pet_sale.mp3',
      verticalRestrictions: [petVertical.id],
      tags: [
        { id: tags[2].id }, // Sale tag
        { id: tags[3].id }  // Promotional tag
      ]
    });

    // ========== 10) Assign content to libraries ==========
    await globalMusicLib.addLibraryContent(globalSongB);
    await petAdsLib.addLibraryContent(petAd);

    console.log('Enhanced seed data created successfully');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Execute the seed function
seed().catch(console.error);

module.exports = seed;
