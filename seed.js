const sequelize = require('./config/database');
const { 
  MusicContent, 
  AdvertisingContent, 
  ContentLibrary,
  User,
  Station,
  Vertical,
  Campaign 
} = require('./models');

const currentDate = new Date('2025-02-23 04:53:26');

const musicContents = [
  {
    title: 'Summer Breeze',
    artist: 'Chill Wave',
    album: 'Beach Vibes',
    genre: 'Electronic',
    fileName: 'summer-breeze.mp3',
    duration: 180,
    tempo: 'medium',
    energy: 'high',
    mood: 'happy',
    dayPartRestrictions: [],
    genres: ['Electronic', 'Chill'],
    formats: ['Contemporary'],
    energyLevel: 7,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    title: 'Mountain Echo',
    artist: 'Nature Sounds',
    album: 'Peaceful Moments',
    genre: 'Ambient',
    fileName: 'mountain-echo.mp3',
    duration: 240,
    tempo: 'slow',
    energy: 'low',
    mood: 'relaxed',
    dayPartRestrictions: [],
    genres: ['Ambient', 'Nature'],
    formats: ['Easy Listening'],
    energyLevel: 3,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    title: 'City Lights',
    artist: 'Urban Beat',
    album: 'Night Drive',
    genre: 'Pop',
    fileName: 'city-lights.mp3',
    duration: 200,
    tempo: 'fast',
    energy: 'high',
    mood: 'energetic',
    dayPartRestrictions: [],
    genres: ['Pop', 'Electronic'],
    formats: ['Contemporary', 'Top 40'],
    energyLevel: 8,
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const campaigns = [
  {
    name: 'Spring 2025 Promotions',
    description: 'Spring season promotional campaign',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-31'),
    status: 'SCHEDULED',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Restaurant Launch Campaign',
    description: 'New restaurant opening promotional campaign',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-04-10'),
    status: 'SCHEDULED',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Insurance Awareness Campaign',
    description: 'Insurance awareness promotional campaign',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-05-31'),
    status: 'SCHEDULED',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const advertisingContents = [
  {
    title: 'Spring Sale Event',
    fileName: 'spring-sale.mp3',
    duration: 30,
    clientName: 'Department Store',
    priority: 5,
    minMinutesBetweenPlays: 30,
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-03-15'),
    playHourRestrictions: [],
    verticalRestrictions: [],
    playCount: 0,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    title: 'New Restaurant Opening',
    fileName: 'restaurant-opening.mp3',
    duration: 45,
    clientName: 'Fine Dining Inc',
    priority: 3,
    minMinutesBetweenPlays: 30,
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-04-10'),
    playHourRestrictions: [],
    verticalRestrictions: [],
    playCount: 0,
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    title: 'Insurance Awareness',
    fileName: 'insurance-ad.mp3',
    duration: 20,
    clientName: 'Insurance Co',
    priority: 1,
    minMinutesBetweenPlays: 30,
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-05-31'),
    playHourRestrictions: [],
    verticalRestrictions: [],
    playCount: 0,
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const contentLibraries = [
  {
    name: 'Default Music Library',
    description: 'General music collection for all stations',
    libraryType: 'GLOBAL_MUSIC',
    contentTypes: ['MUSIC'],
    isAdLibrary: false,
    adminOnly: false,
    restrictions: {},
    metadata: {},
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Primary Ad Library',
    description: 'Main advertising content collection',
    libraryType: 'GLOBAL_MUSIC',
    contentTypes: ['ADVERTISING'],
    isAdLibrary: true,
    adminOnly: false,
    restrictions: {},
    metadata: {},
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const users = [
  {
    name: 'Buck0five',
    username: 'buck0five',
    email: 'buck0five@example.com',
    role: 'ADMIN',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Station Manager',
    username: 'station_manager',
    email: 'manager@example.com',
    role: 'MANAGER',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const verticals = [
  {
    name: 'General Entertainment',
    description: 'General entertainment vertical',
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Sports',
    description: 'Sports-focused vertical',
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

const stations = [
  {
    name: 'Station One',
    description: 'Our first test station',
    verticalId: 1,
    settings: {
      adFrequency: 2,
      maxAdDuration: 60,
      contentFilters: []
    },
    createdAt: currentDate,
    updatedAt: currentDate
  },
  {
    name: 'Station Two',
    description: 'Our second test station',
    verticalId: 2,
    settings: {
      adFrequency: 3,
      maxAdDuration: 45,
      contentFilters: []
    },
    createdAt: currentDate,
    updatedAt: currentDate
  }
];

// ... (keep all the existing code until the seed function)

// ... (keep all the existing imports and data arrays)

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    try {
      // 1. Create users first
      await User.bulkCreate(users);
      console.log('Users created');

      // 2. Create verticals
      await Vertical.bulkCreate(verticals);
      console.log('Verticals created');

      // 3. Create stations
      await Station.bulkCreate(stations);
      console.log('Stations created');

      // 4. Create content libraries
      await ContentLibrary.bulkCreate(contentLibraries);
      console.log('Content libraries created');

      // 5. Create music content
      await MusicContent.bulkCreate(musicContents);
      console.log('Music entries created');

      // 6. Create campaigns
      await Campaign.bulkCreate(campaigns);
      console.log('Campaigns created');

      // 7. Get campaign IDs
      const createdCampaigns = await Campaign.findAll();
      
      // 8. Assign campaign IDs to advertising contents
      const advertisingContentsWithCampaigns = advertisingContents.map((content, index) => ({
        ...content,
        campaignId: createdCampaigns[index].id
      }));

      // 9. Create advertising content
      await AdvertisingContent.bulkCreate(advertisingContentsWithCampaigns);
      console.log('Advertising entries created');

      // Add associations
      const musicLibrary = await ContentLibrary.findOne({
        where: { isAdLibrary: false }
      });

      const adLibrary = await ContentLibrary.findOne({
        where: { isAdLibrary: true }
      });

      const musicContent = await MusicContent.findAll();
      const adContent = await AdvertisingContent.findAll();

      // Create ContentLibraryContent associations for music
      if (musicLibrary && musicContent.length > 0) {
        const musicAssociations = musicContent.map(music => ({
          contentLibraryId: musicLibrary.id,
          musicContentId: music.id,
          contentType: 'MUSIC',
          addedAt: new Date('2025-02-23 05:00:29'),
          createdAt: currentDate,
          updatedAt: currentDate
        }));
        await sequelize.models.ContentLibraryContent.bulkCreate(musicAssociations);
      }

      // Create ContentLibraryContent associations for ads 
      if (adLibrary && adContent.length > 0) {
        const adAssociations = adContent.map(ad => ({
          contentLibraryId: adLibrary.id,
          advertisingContentId: ad.id,
          contentType: 'ADVERTISING',
          addedAt: new Date('2025-02-23 05:00:29'),
          createdAt: currentDate,
          updatedAt: currentDate
        }));
        await sequelize.models.ContentLibraryContent.bulkCreate(adAssociations);
      }

      console.log('Content associations created');

    } catch (err) {
      console.error('Error during seeding:', err);
      console.error('Full error:', JSON.stringify(err, null, 2));
      throw err;
    }

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Fatal seeding error:', err);
    throw err;
  } finally {
    await sequelize.close();
  }
}

// Execute the seed function
seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
