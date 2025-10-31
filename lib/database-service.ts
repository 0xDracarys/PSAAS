/**
 * Database Service - Production-Ready with MongoDB
 * 
 * Strategy:
 * - Development: Uses JSON files (fast, no setup needed)
 * - Production (Netlify): Uses MongoDB Atlas (persistent storage)
 */

import { jsonDatabaseService } from "./json-database"
import { connectToDatabase } from "./mongodb"

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true'

// Singleton MongoDB connection tracker
let mongoConnectionTested = false
let mongoAvailable = false

async function testMongoConnection(): Promise<boolean> {
  if (mongoConnectionTested) return mongoAvailable
  
  try {
    await connectToDatabase()
    mongoAvailable = true
    mongoConnectionTested = true
    console.log('[DB] MongoDB is available for production')
    return true
  } catch (error) {
    mongoAvailable = false
    mongoConnectionTested = true
    console.warn('[DB] MongoDB unavailable, using JSON fallback')
    return false
  }
}

// Initialize (only once per serverless instance)
let initialized = false
async function initialize() {
  if (initialized) return
  
  if (IS_PRODUCTION) {
    await testMongoConnection()
  } else {
    // Development: initialize JSON database
    await jsonDatabaseService.initializeSampleData()
  }
  
  initialized = true
}

export const dbService = {
  async getWebsiteSettings() {
    await initialize()
    
    if (IS_PRODUCTION && mongoAvailable) {
      try {
        const { db } = await connectToDatabase()
        const settings = await db.collection('website_settings').findOne({})
        
        if (!settings) {
          // Seed MongoDB from JSON on first access
          const jsonSettings = await jsonDatabaseService.getWebsiteSettings()
          if (jsonSettings) {
            await db.collection('website_settings').insertOne({
              ...jsonSettings,
              settingsId: 'main_settings',
              updatedAt: new Date().toISOString()
            })
            return jsonSettings
          }
        }
        
        return settings
      } catch (error) {
        console.error('[DB] MongoDB read failed:', error)
      }
    }
    
    return await jsonDatabaseService.getWebsiteSettings()
  },

  async updateWebsiteSettings(settings: any) {
    await initialize()
    
    if (IS_PRODUCTION && mongoAvailable) {
      try {
        const { db } = await connectToDatabase()
        const result = await db.collection('website_settings').updateOne(
          { settingsId: 'main_settings' },
          { 
            $set: {
              ...settings,
              settingsId: 'main_settings',
              updatedAt: new Date().toISOString()
            }
          },
          { upsert: true }
        )
        
        console.log('[DB] Settings saved to MongoDB')
        return true
      } catch (error) {
        console.error('[DB] MongoDB write failed:', error)
        return false
      }
    }
    
    return await jsonDatabaseService.updateWebsiteSettings(settings)
  },

  async getAdminUserByUsername(username: string) {
    await initialize()
    return await jsonDatabaseService.getAdminUserByUsername(username)
  },

  async verifyAdminPassword(username: string, password: string) {
    await initialize()
    return await jsonDatabaseService.verifyAdminPassword(username, password)
  },

  async getProjects(activeOnly = false) {
    await initialize()
    return await jsonDatabaseService.getProjects(activeOnly)
  },

  async getClientRequests(limit = 50, skip = 0) {
    await initialize()
    return await jsonDatabaseService.getClientRequests(limit, skip)
  }
}
