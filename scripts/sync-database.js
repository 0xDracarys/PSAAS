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
    console.error('⚠️  Skipping database sync - will use JSON fallback');
    process.exit(0);
  }

  let client = null;
  try {
    // Read local database file
    const dbPath = path.join(process.cwd(), 'data', 'portfolio-database.json');
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ Database file not found: ${dbPath}`);
      process.exit(1);
    }

    const localData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log('✅ Loaded local database from file');

    // Connect to MongoDB
    client = new mongodb.MongoClient(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    
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

    // Sync admin users - CRITICAL for authentication
    if (localData.adminUsers && localData.adminUsers.length > 0) {
      // Clear existing admin users
      const deleteResult = await db.collection('admin_users').deleteMany({});
      console.log(`✅ Cleared ${deleteResult.deletedCount} old admin users from MongoDB`);
      
      // Insert new admin users
      const insertResult = await db.collection('admin_users').insertMany(localData.adminUsers);
      console.log(`✅ Synced ${insertResult.insertedCount} admin users to MongoDB`);
      
      // Verify the sync
      const verifyUsers = await db.collection('admin_users').find({}).toArray();
      console.log(`✅ Verification: Found ${verifyUsers.length} admin users in MongoDB`);
      verifyUsers.forEach(user => {
        console.log(`   - ${user.username} (role: ${user.role || 'admin'})`);
      });
    }

    // Sync projects
    if (localData.projects && localData.projects.length > 0) {
      const deleteResult = await db.collection('projects').deleteMany({});
      const insertResult = await db.collection('projects').insertMany(localData.projects);
      console.log(`✅ Synced ${insertResult.insertedCount} projects to MongoDB (replaced ${deleteResult.deletedCount})`);
    }

    // Sync themes
    if (localData.themes && localData.themes.length > 0) {
      const deleteResult = await db.collection('themes').deleteMany({});
      const insertResult = await db.collection('themes').insertMany(localData.themes);
      console.log(`✅ Synced ${insertResult.insertedCount} themes to MongoDB`);
    }

    // Sync blogs
    if (localData.blogs && localData.blogs.length > 0) {
      const deleteResult = await db.collection('blogs').deleteMany({});
      const insertResult = await db.collection('blogs').insertMany(localData.blogs);
      console.log(`✅ Synced ${insertResult.insertedCount} blogs to MongoDB`);
    }

    console.log('\n✅ ========================================');
    console.log('✅ Database sync completed successfully!');
    console.log('✅ ========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ========================================');
    console.error('❌ Database sync failed!');
    console.error('❌ ========================================');
    console.error('Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    console.error('\n⚠️  Continuing with build - will use JSON fallback\n');
    process.exit(0); // Don't fail the build if sync fails
  } finally {
    if (client) {
      try {
        await client.close();
        console.log('✅ MongoDB connection closed');
      } catch (e) {
        console.error('Error closing MongoDB connection:', e.message);
      }
    }
  }
}

syncDatabase().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

syncDatabase();
