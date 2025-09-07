#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script ensures all default themes are imported to MongoDB
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db?retryWrites=true&w=majority'

// Default themes data
const defaultThemes = [
  {
    _id: 'theme_futuristic',
    name: 'Futuristic Matrix',
    isActive: true,
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00d4ff',
      background: '#0a0a0a',
      foreground: '#ffffff',
      muted: '#1a1a1a',
      border: '#333333',
      card: '#111111',
      popover: '#1a1a1a',
      destructive: '#ff4444',
      warning: '#ffaa00',
      success: '#00ff88',
      textPrimary: '#ffffff',
      textSecondary: '#cccccc',
      textMuted: '#888888',
      textAccent: '#00ff88',
      textInverse: '#000000',
    },
    typography: {
      fontFamily: 'JetBrains Mono, "Fira Code", monospace',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
    layout: {
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
    },
    components: {
      button: {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
      },
      card: {
        padding: '1.5rem',
        borderRadius: '1rem',
        borderWidth: '1px',
      },
      input: {
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        borderWidth: '1px',
      },
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out',
    },
    effects: {
      backgroundParticles: true,
      glowEffects: true,
      glassmorphism: true,
      neonBorders: true,
      gradientBackgrounds: true,
      animatedElements: true,
      hoverEffects: true,
      scrollAnimations: true,
    },
    customCSS: '',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more default themes here...
]

async function initializeDatabase() {
  let client
  
  try {
    console.log('🔌 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db('portfolio_db')
    const themesCollection = db.collection('themes')
    
    console.log('📊 Checking existing themes...')
    const existingThemes = await themesCollection.find({}).toArray()
    console.log(`Found ${existingThemes.length} existing themes`)
    
    if (existingThemes.length === 0) {
      console.log('📝 Importing default themes...')
      const result = await themesCollection.insertMany(defaultThemes)
      console.log(`✅ Successfully imported ${result.insertedCount} themes`)
    } else {
      console.log('✅ Themes already exist in database')
    }
    
    // Create indexes
    console.log('🔍 Creating indexes...')
    await themesCollection.createIndex({ isActive: 1 })
    await themesCollection.createIndex({ createdAt: -1 })
    await themesCollection.createIndex({ _id: 1 })
    
    console.log('✅ Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 MongoDB connection closed')
    }
  }
}

// Run the initialization
initializeDatabase()




