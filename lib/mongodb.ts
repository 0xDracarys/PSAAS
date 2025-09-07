// MongoDB Atlas connection utility
// This file provides database connection and helper functions for future backend integration

import { MongoClient, type Db, type Collection, ObjectId } from "mongodb"
import { memoryDbService, type MemoryClientRequest, type MemoryProject, type MemoryAdminUser } from "./memory-storage"

// MongoDB Atlas connection string - to be set in environment variables
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db?retryWrites=true&w=majority"
const MONGODB_DB = process.env.MONGODB_DB || "portfolio_db"

// Global variable to cache the database connection
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

// Connect to MongoDB Atlas
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    console.log("Attempting to connect to MongoDB...")
    console.log("MONGODB_URI:", MONGODB_URI ? "Found" : "Not found")
    console.log("MONGODB_DB:", MONGODB_DB)
    
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 10000, // 10 second timeout
    })
    
    await client.connect()
    console.log("Successfully connected to MongoDB")

    const db = client.db(MONGODB_DB)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    console.error("MONGODB_URI:", MONGODB_URI)
    throw error
  }
}

// Collection interfaces for type safety
export interface ClientRequest {
  _id?: string
  name: string
  email: string
  phone: string
  projectType: string
  requirements: string
  budget: string
  timeline: string
  referenceLinks?: string[]
  files?: string[]
  acceptedTerms: boolean
  paymentTerms: string
  createdAt: Date
  status: "pending" | "reviewed" | "approved" | "rejected"
}

export interface Project {
  _id?: string
  id?: string
  title: string
  description: string
  image: string
  tags: string[]
  github: string
  demo: string
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // Admin dashboard specific fields
  client?: string
  status?: "completed" | "in-progress" | "pending"
  budget?: number
  startDate?: string
  endDate?: string
  progress?: number
}

export interface AdminUser {
  _id?: string
  username: string
  email: string
  passwordHash: string
  role: "admin" | "user"
  createdAt: Date
  lastLogin?: Date
}

export interface WebsiteSettings {
  _id?: string
  profile: {
    name: string
    title: string
    bio: string
    location: string
    email: string
    phone: string
    profileImage: string
    coverImage: string
  }
  experience: Array<{
    year: string
    title: string
    company: string
    description: string
  }>
  skills: Array<{
    name: string
    level: number
  }>
  socialLinks: Array<{
    icon: string
    label: string
    href: string
    color: string
  }>
  personalInterests: Array<{
    icon: string
    title: string
    description: string
    color: string
  }>
  musicTracks: Array<{
    title: string
    description: string
    duration: string
    genre: string
  }>
  contactInfo: Array<{
    icon: string
    label: string
    value: string
    href: string
    description: string
  }>
  updatedAt: Date
}

// Helper functions for database operations
export class DatabaseService {
  private db: Db | null = null
  private useMemoryStorage = false
  private initialized = false

  async init() {
    if (this.initialized || isGloballyInitialized) {
      console.log(`[DatabaseService] Already initialized, useMemoryStorage: ${this.useMemoryStorage}`)
      return
    }

    try {
      console.log(`[DatabaseService] Attempting to connect to MongoDB...`)
      const { db } = await connectToDatabase()
      this.db = db
      this.useMemoryStorage = false
      console.log("MongoDB connection successful")
    } catch (error) {
      console.warn("MongoDB connection failed, falling back to memory storage:", error.message)
      this.useMemoryStorage = true
      // Initialize memory storage as fallback
      await memoryDbService.init()
    }
    
    this.initialized = true
    isGloballyInitialized = true
    console.log(`[DatabaseService] Initialization complete, useMemoryStorage: ${this.useMemoryStorage}`)
  }

  // Client Requests operations
  async createClientRequest(request: Omit<ClientRequest, "_id" | "createdAt" | "status">): Promise<string> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.createClientRequest(request as any)
    }

    const collection: Collection<ClientRequest> = this.db!.collection("client_requests")
    const requestId = `req_${Date.now()}`
    const result = await collection.insertOne({
      ...request,
      _id: requestId, // Use _id for MongoDB
      id: requestId, // Also set id for compatibility
      createdAt: new Date(),
      status: "pending",
    })

    return requestId
  }

  async getClientRequests(limit = 50, skip = 0): Promise<ClientRequest[]> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getClientRequests(limit, skip) as any
    }

    const collection: Collection<ClientRequest> = this.db!.collection("client_requests")
    return await collection.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()
  }

  async updateClientRequestStatus(id: string, status: ClientRequest["status"]): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.updateClientRequestStatus(id, status as any)
    }

    const collection: Collection<ClientRequest> = this.db!.collection("client_requests")
    const result = await collection.updateOne({ _id: id }, { $set: { status, updatedAt: new Date() } })

    return result.modifiedCount > 0
  }

  async updateClientRequest(id: string, updateData: Partial<ClientRequest>): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.updateClientRequest(id, updateData as any)
    }

    const collection: Collection<ClientRequest> = this.db!.collection("client_requests")
    // Remove _id from updateData to prevent MongoDB error
    const { _id, ...safeUpdateData } = updateData as any
    const result = await collection.updateOne({ _id: id }, { $set: { ...safeUpdateData, updatedAt: new Date() } })

    return result.modifiedCount > 0
  }

  // Projects operations
  async createProject(project: Omit<Project, "_id" | "createdAt" | "updatedAt">): Promise<string> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.createProject(project as any)
    }

    const collection: Collection<Project> = this.db!.collection("projects")
    const projectId = `proj_${Date.now()}`
    const result = await collection.insertOne({
      ...project,
      _id: projectId, // Use _id for MongoDB
      id: projectId, // Also set id for compatibility
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return projectId
  }

  async getProjects(activeOnly = false): Promise<Project[]> {
    if (!this.initialized) await this.init()

    console.log(`[MongoDB] getProjects called, useMemoryStorage: ${this.useMemoryStorage}`)

    if (this.useMemoryStorage) {
      console.log(`[MongoDB] Using memory storage for projects`)
      const memoryProjects = await memoryDbService.getProjects(activeOnly)
      return memoryProjects.map(project => ({
        _id: project._id,
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.tags,
        github: project.github,
        demo: project.demo,
        features: project.features,
        isActive: project.isActive,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        client: project.client,
        status: project.status,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        progress: project.progress,
      }))
    }

    try {
      console.log(`[MongoDB] Using MongoDB for projects`)
      console.log(`[MongoDB] Database connection:`, this.db ? 'Connected' : 'Not connected')
      
      if (!this.db) {
        throw new Error("Database not connected")
      }
      
      const collection: Collection<Project> = this.db.collection("projects")
      const filter = activeOnly ? { isActive: true } : {}

      const projects = await collection.find(filter).sort({ createdAt: -1 }).toArray()
      console.log(`[MongoDB] Raw projects from database:`, projects.length > 0 ? Object.keys(projects[0]) : 'No projects')
      
      // Ensure all projects have both _id and id fields
      return projects.map(project => ({
        ...project,
        _id: project._id || project.id || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        id: project.id || project._id?.toString() || `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    } catch (error) {
      console.error(`[MongoDB] Error in getProjects:`, error)
      throw error
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<boolean> {
    if (!this.db) await this.init()

    const collection: Collection<Project> = this.db!.collection("projects")
    
    console.log(`[MongoDB] Attempting to update project with ID: ${id}`)
    
    // Remove _id from updates to avoid MongoDB error
    const { _id, ...updatesWithoutId } = updates as any
    
    // Try to update by id field first (since that's what we're using in the API)
    let result = await collection.updateOne({ id: id }, { $set: { ...updatesWithoutId, updatedAt: new Date() } })
    console.log(`[MongoDB] Update by id result:`, result.modifiedCount)
    
    // If not found by id, try by _id (in case it's an ObjectId string)
    if (result.modifiedCount === 0) {
      try {
        const objectId = new ObjectId(id)
        result = await collection.updateOne({ _id: objectId }, { $set: { ...updatesWithoutId, updatedAt: new Date() } })
        console.log(`[MongoDB] Update by _id (ObjectId) result:`, result.modifiedCount)
      } catch (error) {
        console.log(`[MongoDB] ID is not a valid ObjectId: ${id}`)
        // Try to find by _id as string
        result = await collection.updateOne({ _id: id }, { $set: { ...updatesWithoutId, updatedAt: new Date() } })
        console.log(`[MongoDB] Update by _id (string) result:`, result.modifiedCount)
      }
    }

    return result.modifiedCount > 0
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!this.db) await this.init()

    const collection: Collection<Project> = this.db!.collection("projects")
    // Try to delete by _id first, then by id field
    let result = await collection.deleteOne({ _id: id })
    
    if (result.deletedCount === 0) {
      result = await collection.deleteOne({ id: id })
    }

    return result.deletedCount > 0
  }

  // Admin operations
  async createAdminUser(user: Omit<AdminUser, "_id" | "createdAt">): Promise<string> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.createAdminUser(user as any)
    }

    const collection: Collection<AdminUser> = this.db!.collection("admin_users")
    const result = await collection.insertOne({
      ...user,
      createdAt: new Date(),
    })

    return result.insertedId.toString()
  }

  async getAdminUser(username: string): Promise<AdminUser | null> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getAdminUser(username) as any
    }

    const collection: Collection<AdminUser> = this.db!.collection("admin_users")
    return await collection.findOne({ username })
  }

  async updateLastLogin(username: string): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.updateLastLogin(username)
    }

    const collection: Collection<AdminUser> = this.db!.collection("admin_users")
    const result = await collection.updateOne({ username }, { $set: { lastLogin: new Date() } })

    return result.modifiedCount > 0
  }

  // Website Settings operations
  async getWebsiteSettings(): Promise<WebsiteSettings | null> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      // Don't overwrite existing data - return null if no settings exist
      const memorySettings = await memoryDbService.getWebsiteSettings()
      return memorySettings || null
    }

    const collection: Collection<WebsiteSettings> = this.db!.collection("website_settings")
    return await collection.findOne({})
  }

  async updateWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.updateWebsiteSettings(settings as any)
    }

    const collection: Collection<WebsiteSettings> = this.db!.collection("website_settings")
    
    // Remove _id from settings to avoid MongoDB error
    const { _id, ...settingsWithoutId } = settings as any
    
    const result = await collection.updateOne(
      {},
      { $set: { ...settingsWithoutId, updatedAt: new Date() } },
      { upsert: true }
    )

    return result.modifiedCount > 0 || result.upsertedCount > 0
  }

  // Theme operations
  async getThemes(): Promise<any[]> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getThemes() as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getActiveTheme(): Promise<any | null> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getActiveTheme() as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    return await collection.findOne({ isActive: true })
  }

  async getThemeById(id: string): Promise<any | null> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getThemeById(id) as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    return await collection.findOne({ _id: id })
  }

  async createTheme(theme: any): Promise<string> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.createTheme(theme) as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    const themeId = theme._id || `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const result = await collection.insertOne({
      ...theme,
      _id: themeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return themeId
  }

  async updateTheme(id: string, updates: any): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.updateTheme(id, updates) as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    // Remove _id from updates to prevent MongoDB error
    const { _id, ...updatesWithoutId } = updates as any
    
    const result = await collection.updateOne(
      { _id: id },
      { $set: { ...updatesWithoutId, updatedAt: new Date() } }
    )

    return result.modifiedCount > 0
  }

  async deleteTheme(id: string): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.deleteTheme(id) as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    const result = await collection.deleteOne({ _id: id })

    return result.deletedCount > 0
  }

  async setActiveTheme(id: string): Promise<boolean> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.setActiveTheme(id) as any
    }

    const collection: Collection<any> = this.db!.collection("themes")
    
    // First, deactivate all themes
    await collection.updateMany({}, { $set: { isActive: false, updatedAt: new Date() } })
    
    // Then activate the selected theme
    const result = await collection.updateOne(
      { _id: id },
      { $set: { isActive: true, updatedAt: new Date() } }
    )

    return result.modifiedCount > 0
  }

  async getThemeHistory(): Promise<any[]> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.getThemeHistory() as any
    }

    const collection: Collection<any> = this.db!.collection("theme_history")
    return await collection.find({}).sort({ timestamp: -1 }).toArray()
  }

  async addThemeHistory(entry: any): Promise<void> {
    if (!this.initialized) await this.init()

    if (this.useMemoryStorage) {
      return await memoryDbService.addThemeHistory(entry) as any
    }

    const collection: Collection<any> = this.db!.collection("theme_history")
    await collection.insertOne({
      ...entry,
      timestamp: new Date(),
    })
  }

  // Blog operations
  async getBlogs(limit: number = 50, skip: number = 0, filter: any = {}): Promise<any[]> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.getBlogs(limit, skip, filter) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    return await collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
  }

  async getBlogById(id: string): Promise<any | null> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.getBlogById(id) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    return await collection.findOne({ _id: id })
  }

  async createBlog(blog: any): Promise<string> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.createBlog(blog) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    const result = await collection.insertOne({
      ...blog,
      _id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return result.insertedId
  }

  async updateBlog(id: string, updateData: any): Promise<boolean> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.updateBlog(id, updateData) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    const { _id, ...safeUpdateData } = updateData as any
    const result = await collection.updateOne(
      { _id: id },
      { $set: { ...safeUpdateData, updatedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  async deleteBlog(id: string): Promise<boolean> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.deleteBlog(id) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    const result = await collection.deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  async incrementBlogViews(id: string): Promise<boolean> {
    if (!this.initialized) await this.init()
    if (this.useMemoryStorage) {
      return await memoryDbService.incrementBlogViews(id) as any
    }
    const collection: Collection<any> = this.db!.collection("blogs")
    const result = await collection.updateOne(
      { _id: id },
      { $inc: { views: 1 } }
    )
    return result.modifiedCount > 0
  }
}

// Global database service instance
let dbServiceInstance: DatabaseService | null = null
let isGloballyInitialized = false

// Initialize database service once
async function initializeDbService() {
  if (isGloballyInitialized) {
    return dbServiceInstance!
  }

  if (!dbServiceInstance) {
    dbServiceInstance = new DatabaseService()
  }

  await dbServiceInstance.init()
  isGloballyInitialized = true
  return dbServiceInstance
}

// Export function to get initialized database service
export async function getDbService(): Promise<DatabaseService> {
  return await initializeDbService()
}

// Export singleton instance for backward compatibility
export const dbService = {
  async init() {
    return await initializeDbService()
  },
  async createClientRequest(request: any) {
    const service = await initializeDbService()
    return await service.createClientRequest(request)
  },
  async getClientRequests(limit?: number, skip?: number) {
    try {
      const service = await initializeDbService()
      const requests = await service.getClientRequests(limit, skip)
      console.log(`✅ Loaded ${requests.length} client requests from MongoDB`)
      return requests
    } catch (error) {
      console.error("Error getting client requests from MongoDB:", error)
      console.log("Falling back to memory storage...")
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      const requests = await memoryService.getClientRequests(limit, skip)
      console.log(`📦 Loaded ${requests.length} client requests from memory storage`)
      return requests
    }
  },
  async updateClientRequestStatus(id: string, status: any) {
    const service = await initializeDbService()
    return await service.updateClientRequestStatus(id, status)
  },
  async updateClientRequest(id: string, updateData: any) {
    try {
      const service = await initializeDbService()
      return await service.updateClientRequest(id, updateData)
    } catch (error) {
      console.error("Error updating client request via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.updateClientRequest(id, updateData)
    }
  },
  async createProject(project: any) {
    const service = await initializeDbService()
    return await service.createProject(project)
  },
  async getProjects(activeOnly?: boolean) {
    try {
      console.log(`[dbService] Attempting to get projects from MongoDB...`)
      const service = await initializeDbService()
      console.log(`[dbService] Service initialized, useMemoryStorage: ${service.useMemoryStorage}`)
      
      // Force MongoDB usage - no memory storage fallback
      if (service.useMemoryStorage) {
        console.log(`[dbService] Service is configured for memory storage, forcing re-initialization...`)
        await service.init() // Re-initialize to try MongoDB again
      }
      
      const projects = await service.getProjects(activeOnly)
      console.log(`✅ Loaded ${projects.length} projects from MongoDB`)
      console.log(`[DEBUG] First project structure:`, projects[0] ? Object.keys(projects[0]) : 'No projects')
      return projects
    } catch (error) {
      console.error("Error getting projects from MongoDB:", error)
      console.log("Falling back to memory storage...")
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      const memoryProjects = await memoryService.getProjects(activeOnly)
      console.log(`📦 Loaded ${memoryProjects.length} projects from memory storage`)
      console.log(`[DEBUG] First memory project structure:`, memoryProjects[0] ? Object.keys(memoryProjects[0]) : 'No projects')
      // Map memory projects to include both _id and id fields
      return memoryProjects.map(project => ({
        _id: project._id,
        id: project.id || project._id, // Use _id as id if id is missing
        title: project.title,
        description: project.description,
        image: project.image,
        tags: project.tags,
        github: project.github,
        demo: project.demo,
        features: project.features,
        isActive: project.isActive,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        client: project.client,
        status: project.status,
        budget: project.budget,
        startDate: project.startDate,
        endDate: project.endDate,
        progress: project.progress,
      }))
    }
  },
  async updateProject(id: string, updates: any) {
    try {
      const service = await initializeDbService()
      return await service.updateProject(id, updates)
    } catch (error) {
      console.error('Error updating project via service:', error)
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      return await memoryService.updateProject(id, updates)
    }
  },
  async deleteProject(id: string) {
    try {
      const service = await initializeDbService()
      return await service.deleteProject(id)
    } catch (error) {
      console.error('Error deleting project via service:', error)
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      return await memoryService.deleteProject(id)
    }
  },
  async createAdminUser(user: any) {
    const service = await initializeDbService()
    return await service.createAdminUser(user)
  },
  async getAdminUser(username: string) {
    const service = await initializeDbService()
    return await service.getAdminUser(username)
  },
  async updateLastLogin(username: string) {
    const service = await initializeDbService()
    return await service.updateLastLogin(username)
  },
  async getWebsiteSettings() {
    try {
      const service = await initializeDbService()
      const settings = await service.getWebsiteSettings()
      console.log(`✅ Loaded website settings from MongoDB`)
      return settings
    } catch (error) {
      console.error("Error getting website settings from MongoDB:", error)
      console.log("Falling back to memory storage...")
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      const settings = await memoryService.getWebsiteSettings()
      console.log(`📦 Loaded website settings from memory storage`)
      return settings
    }
  },
  async updateWebsiteSettings(settings: any) {
    try {
      const service = await initializeDbService()
      return await service.updateWebsiteSettings(settings)
    } catch (error) {
      console.error("Error updating website settings via MongoDB:", error)
      console.log("Falling back to memory storage...")
      // Fallback to memory storage
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      return await memoryService.updateWebsiteSettings(settings)
    }
  },
  // Theme operations
  async getThemes() {
    try {
      const service = await initializeDbService()
      const themes = await service.getThemes()
      console.log(`✅ Loaded ${themes.length} themes from MongoDB`)
      return themes
    } catch (error) {
      console.error("Error getting themes from MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.getThemes()
    }
  },
  async getActiveTheme() {
    try {
      const service = await initializeDbService()
      const theme = await service.getActiveTheme()
      console.log(`✅ Loaded active theme from MongoDB`)
      return theme
    } catch (error) {
      console.error("Error getting active theme from MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.getActiveTheme()
    }
  },
  async getThemeById(id: string) {
    try {
      const service = await initializeDbService()
      return await service.getThemeById(id)
    } catch (error) {
      console.error("Error getting theme by ID from MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.getThemeById(id)
    }
  },
  async createTheme(theme: any) {
    try {
      const service = await initializeDbService()
      return await service.createTheme(theme)
    } catch (error) {
      console.error("Error creating theme via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.createTheme(theme)
    }
  },
  async updateTheme(id: string, updates: any) {
    try {
      const service = await initializeDbService()
      return await service.updateTheme(id, updates)
    } catch (error) {
      console.error("Error updating theme via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.updateTheme(id, updates)
    }
  },
  async deleteTheme(id: string) {
    try {
      const service = await initializeDbService()
      return await service.deleteTheme(id)
    } catch (error) {
      console.error("Error deleting theme via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.deleteTheme(id)
    }
  },
  async setActiveTheme(id: string) {
    try {
      const service = await initializeDbService()
      return await service.setActiveTheme(id)
    } catch (error) {
      console.error("Error setting active theme via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.setActiveTheme(id)
    }
  },
  async getThemeHistory() {
    try {
      const service = await initializeDbService()
      return await service.getThemeHistory()
    } catch (error) {
      console.error("Error getting theme history from MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.getThemeHistory()
    }
  },
  async addThemeHistory(entry: any) {
    try {
      const service = await initializeDbService()
      return await service.addThemeHistory(entry)
    } catch (error) {
      console.error("Error adding theme history via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.addThemeHistory(entry)
    }
  },
  // Blog operations
  async getBlogs(limit: number = 50, skip: number = 0, filter: any = {}) {
    try {
      const service = await initializeDbService()
      const blogs = await service.getBlogs(limit, skip, filter)
      console.log(`✅ Loaded ${blogs.length} blogs from MongoDB`)
      return blogs
    } catch (error) {
      console.error("Error getting blogs from MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      const blogs = await memoryService.getBlogs(limit, skip, filter)
      console.log(`📦 Loaded ${blogs.length} blogs from memory storage`)
      return blogs
    }
  },
  async getBlogById(id: string) {
    try {
      const service = await initializeDbService()
      return await service.getBlogById(id)
    } catch (error) {
      console.error("Error getting blog by ID via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.getBlogById(id)
    }
  },
  async createBlog(blog: any) {
    try {
      const service = await initializeDbService()
      return await service.createBlog(blog)
    } catch (error) {
      console.error("Error creating blog via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.createBlog(blog)
    }
  },
  async updateBlog(id: string, updateData: any) {
    try {
      const service = await initializeDbService()
      return await service.updateBlog(id, updateData)
    } catch (error) {
      console.error("Error updating blog via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.updateBlog(id, updateData)
    }
  },
  async deleteBlog(id: string) {
    try {
      const service = await initializeDbService()
      return await service.deleteBlog(id)
    } catch (error) {
      console.error("Error deleting blog via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.deleteBlog(id)
    }
  },
  async incrementBlogViews(id: string) {
    try {
      const service = await initializeDbService()
      return await service.incrementBlogViews(id)
    } catch (error) {
      console.error("Error incrementing blog views via MongoDB:", error)
      console.log("Falling back to memory storage...")
      const memoryService = new (await import('./memory-storage')).MemoryDatabaseService()
      memoryService.disableFilePersistence() // Don't persist to file when used as fallback
      return await memoryService.incrementBlogViews(id)
    }
  }
}

// Database initialization script for MongoDB Atlas
export const initializeDatabase = async () => {
  try {
    const { db } = await connectToDatabase()

    // Create indexes for better performance
    await db.collection("client_requests").createIndex({ email: 1 })
    await db.collection("client_requests").createIndex({ createdAt: -1 })
    await db.collection("client_requests").createIndex({ status: 1 })

    await db.collection("projects").createIndex({ isActive: 1 })
    await db.collection("projects").createIndex({ createdAt: -1 })

    await db.collection("admin_users").createIndex({ username: 1 }, { unique: true })
    await db.collection("admin_users").createIndex({ email: 1 }, { unique: true })

    await db.collection("themes").createIndex({ isActive: 1 })
    await db.collection("themes").createIndex({ createdAt: -1 })
    await db.collection("themes").createIndex({ _id: 1 })

    await db.collection("theme_history").createIndex({ timestamp: -1 })
    await db.collection("theme_history").createIndex({ themeId: 1 })

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization failed:", error)
    throw error
  }
}
