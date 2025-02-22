const {
  sequelize,
  MusicContent,
  AdvertisingContent,
  StationContent
} = require('./models');

async function seed() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synced with force: true');

    // Create music entries
    const musicEntries = [
      {
        title: "Summer Breeze",
        artist: "Beach Band",
        duration: 180,
        energyLevel: 4,
        formats: ["MP3"],
        fileName: "summer-breeze.mp3",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Urban Night",
        artist: "Electronic Minds",
        duration: 240,
        energyLevel: 8,
        formats: ["WAV"],
        fileName: "urban-night.wav",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Mountain Echo",
        artist: "Nature Sounds",
        duration: 300,
        energyLevel: 2,
        formats: ["FLAC"],
        fileName: "mountain-echo.flac",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      }
    ];

    // Create advertising entries
    const advertisingEntries = [
      {
        title: "Spring Sale Event",
        duration: 30,
        campaign: "Spring 2025",
        priority: "high",
        fileName: "spring-sale.mp3",
        startDate: new Date("2025-03-01T00:00:00Z"),
        endDate: new Date("2025-03-15T23:59:59Z"),
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "New Restaurant Opening",
        duration: 45,
        campaign: "Grand Opening",
        priority: "medium",
        fileName: "restaurant-opening.mp3",
        startDate: new Date("2025-03-10T00:00:00Z"),
        endDate: new Date("2025-04-10T23:59:59Z"),
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Insurance Awareness",
        duration: 20,
        campaign: "Protection Plus",
        priority: "low",
        fileName: "insurance-ad.mp3",
        startDate: new Date("2025-03-01T00:00:00Z"),
        endDate: new Date("2025-05-31T23:59:59Z"),
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      }
    ];

    // Create station entries
    const stationEntries = [
      {
        title: "Morning News Update",
        contentType: "NEWS",
        duration: 120,
        station: "WXYZ",
        fileName: "morning-news.mp3",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Weather Report",
        contentType: "WEATHER",
        duration: 60,
        station: "WXYZ",
        fileName: "weather.mp3",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Station ID",
        contentType: "ID",
        duration: 10,
        station: "WXYZ",
        fileName: "station-id.mp3",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      },
      {
        title: "Weekend Special",
        contentType: "PROMO",
        duration: 30,
        station: "WXYZ",
        fileName: "weekend-promo.mp3",
        createdAt: new Date("2025-02-22T21:50:55Z"),
        updatedAt: new Date("2025-02-22T21:50:55Z")
      }
    ];

    // Bulk create all entries
    await MusicContent.bulkCreate(musicEntries);
    console.log('Music entries created');
    
    await AdvertisingContent.bulkCreate(advertisingEntries);
    console.log('Advertising entries created');
    
    await StationContent.bulkCreate(stationEntries);
    console.log('Station entries created');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Execute the seed function
seed().catch(console.error);

module.exports = seed;
