/**
 * Database Sync Script
 * Syncs data from portfolio-database.json to MongoDB
 * Run this before deploying to production
 */

const fs = require('fs');
const path = require('path');
const mongodb = require('mongodb');

async function syncDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'portfolio_db';

  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  try {
    // Read local database file
    const dbPath = path.join(process.cwd(), 'data', 'portfolio-database.json');
    const localData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    console.log('✅ Loaded local database from file');

    // Connect to MongoDB
    const client = new mongodb.MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // Sync website settings
    if (localData.websiteSettings && localData.websiteSettings.length > 0) {
      const settings = localData.websiteSettings[0];
      await db.collection('website_settings').updateOne(
        { settingsId: 'main_settings' },
        {
          $set: {
            ...settings,
            settingsId: 'main_settings',
            updatedAt: new Date().toISOString(),
          }
        },
        { upsert: true }
      );
      console.log('✅ Synced website settings to MongoDB');
    }

    // Sync admin users
    if (localData.adminUsers && localData.adminUsers.length > 0) {
      await db.collection('admin_users').deleteMany({});
      await db.collection('admin_users').insertMany(localData.adminUsers);
      console.log('✅ Synced admin users to MongoDB');
    }

    // Sync projects
    if (localData.projects && localData.projects.length > 0) {
      await db.collection('projects').deleteMany({});
      await db.collection('projects').insertMany(localData.projects);
      console.log('✅ Synced projects to MongoDB');
    }

    // Sync themes
    if (localData.themes && localData.themes.length > 0) {
      await db.collection('themes').deleteMany({});
      await db.collection('themes').insertMany(localData.themes);
      console.log('✅ Synced themes to MongoDB');
    }

    // Sync blogs
    if (localData.blogs && localData.blogs.length > 0) {
      await db.collection('blogs').deleteMany({});
      await db.collection('blogs').insertMany(localData.blogs);
      console.log('✅ Synced blogs to MongoDB');
    }

    console.log('✅ Database sync complete');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase();
