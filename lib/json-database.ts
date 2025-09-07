import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

export interface DatabaseProject {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DatabaseClientRequest {
  id: string
  name: string
  email: string
  company?: string
  projectType: string
  budget: string
  timeline: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface DatabaseAdminUser {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface DatabaseWebsiteSettings {
  id: string
  profile: any
  experience: any[]
  skills: any[]
  socialLinks: any[]
  personalInterests: any[]
  musicTracks: any[]
  contactInfo: any[]
  updatedAt: string
}

export interface DatabaseTheme {
  id: string
  name: string
  isActive: boolean
  settings: any
  createdAt: string
  updatedAt: string
}

export interface DatabaseChatSession {
  id: string
  messages: any[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export class JsonDatabaseService {
  private dataDir: string
  private dataFile: string

  constructor() {
    this.dataDir = join(process.cwd(), 'data')
    this.dataFile = join(this.dataDir, 'portfolio-database.json')
    this.ensureDataDirectory()
  }

  private ensureDataDirectory(): void {
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true })
    }
  }

  private loadData(): any {
    if (!existsSync(this.dataFile)) {
      return {
        projects: [],
        clientRequests: [],
        adminUsers: [],
        websiteSettings: [],
        themes: [],
        chatSessions: []
      }
    }

    try {
      const data = JSON.parse(readFileSync(this.dataFile, 'utf8'))
      return {
        projects: data.projects || [],
        clientRequests: data.clientRequests || [],
        adminUsers: data.adminUsers || [],
        websiteSettings: data.websiteSettings || [],
        themes: data.themes || [],
        chatSessions: data.chatSessions || []
      }
    } catch (error) {
      console.error('Error loading database:', error)
      return {
        projects: [],
        clientRequests: [],
        adminUsers: [],
        websiteSettings: [],
        themes: [],
        chatSessions: []
      }
    }
  }

  private saveData(data: any): void {
    try {
      writeFileSync(this.dataFile, JSON.stringify(data, null, 2))
      console.log('✅ Data saved to JSON database')
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }

  // Projects CRUD
  async createProject(project: Omit<DatabaseProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const data = this.loadData()
    const id = `proj_${Date.now()}`
    const now = new Date().toISOString()
    
    const newProject: DatabaseProject = {
      id,
      ...project,
      createdAt: now,
      updatedAt: now
    }
    
    data.projects.push(newProject)
    this.saveData(data)
    return id
  }

  async getProjects(activeOnly = false): Promise<DatabaseProject[]> {
    const data = this.loadData()
    let projects = data.projects
    
    if (activeOnly) {
      projects = projects.filter((p: DatabaseProject) => p.isActive)
    }
    
    return projects.sort((a: DatabaseProject, b: DatabaseProject) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async updateProject(id: string, updates: Partial<DatabaseProject>): Promise<boolean> {
    const data = this.loadData()
    const projectIndex = data.projects.findIndex((p: DatabaseProject) => p.id === id)
    
    if (projectIndex === -1) return false
    
    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveData(data)
    return true
  }

  async deleteProject(id: string): Promise<boolean> {
    const data = this.loadData()
    const projectIndex = data.projects.findIndex((p: DatabaseProject) => p.id === id)
    
    if (projectIndex === -1) return false
    
    data.projects.splice(projectIndex, 1)
    this.saveData(data)
    return true
  }

  // Client Requests CRUD
  async createClientRequest(request: Omit<DatabaseClientRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const data = this.loadData()
    const id = `req_${Date.now()}`
    const now = new Date().toISOString()
    
    const newRequest: DatabaseClientRequest = {
      id,
      ...request,
      createdAt: now,
      updatedAt: now
    }
    
    data.clientRequests.push(newRequest)
    this.saveData(data)
    return id
  }

  async getClientRequests(limit = 50, skip = 0): Promise<DatabaseClientRequest[]> {
    const data = this.loadData()
    return data.clientRequests
      .sort((a: DatabaseClientRequest, b: DatabaseClientRequest) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(skip, skip + limit)
  }

  async updateClientRequestStatus(id: string, status: string): Promise<boolean> {
    const data = this.loadData()
    const requestIndex = data.clientRequests.findIndex((r: DatabaseClientRequest) => r.id === id)
    
    if (requestIndex === -1) return false
    
    data.clientRequests[requestIndex].status = status as any
    data.clientRequests[requestIndex].updatedAt = new Date().toISOString()
    
    this.saveData(data)
    return true
  }

  // Website Settings CRUD
  async getWebsiteSettings(): Promise<DatabaseWebsiteSettings | null> {
    const data = this.loadData()
    return data.websiteSettings[0] || null
  }

  async updateWebsiteSettings(settings: any): Promise<boolean> {
    const data = this.loadData()
    
    if (data.websiteSettings.length === 0) {
      data.websiteSettings.push({
        id: 'settings_1',
        profile: settings.profile || {},
        experience: settings.experience || [],
        skills: settings.skills || [],
        socialLinks: settings.socialLinks || [],
        personalInterests: settings.personalInterests || [],
        musicTracks: settings.musicTracks || [],
        contactInfo: settings.contactInfo || [],
        updatedAt: new Date().toISOString()
      })
    } else {
      data.websiteSettings[0] = {
        ...data.websiteSettings[0],
        ...settings,
        updatedAt: new Date().toISOString()
      }
    }
    
    this.saveData(data)
    return true
  }

  // Admin Users CRUD
  async createAdminUser(user: Omit<DatabaseAdminUser, 'id' | 'createdAt'>): Promise<string> {
    const data = this.loadData()
    const id = `admin_${Date.now()}`
    const now = new Date().toISOString()
    
    const newUser: DatabaseAdminUser = {
      id,
      ...user,
      createdAt: now
    }
    
    data.adminUsers.push(newUser)
    this.saveData(data)
    return id
  }

  async getAdminUserByUsername(username: string): Promise<DatabaseAdminUser | null> {
    const data = this.loadData()
    return data.adminUsers.find((u: DatabaseAdminUser) => u.username === username) || null
  }

  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    const user = await this.getAdminUserByUsername(username)
    if (!user) return false
    
    return await bcrypt.compare(password, user.passwordHash)
  }

  // Themes CRUD
  async createTheme(theme: any): Promise<string> {
    const data = this.loadData()
    const id = theme._id || `theme_${Date.now()}`
    const now = new Date().toISOString()
    
    const newTheme: DatabaseTheme = {
      id,
      name: theme.name,
      isActive: theme.isActive || false,
      settings: theme,
      createdAt: now,
      updatedAt: now
    }
    
    // Remove existing theme with same id
    data.themes = data.themes.filter((t: DatabaseTheme) => t.id !== id)
    data.themes.push(newTheme)
    
    this.saveData(data)
    return id
  }

  async getThemes(): Promise<DatabaseTheme[]> {
    const data = this.loadData()
    return data.themes.sort((a: DatabaseTheme, b: DatabaseTheme) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async activateTheme(themeId: string): Promise<boolean> {
    const data = this.loadData()
    
    // Deactivate all themes
    data.themes.forEach((theme: DatabaseTheme) => {
      theme.isActive = false
    })
    
    // Activate the selected theme
    const themeIndex = data.themes.findIndex((t: DatabaseTheme) => t.id === themeId)
    if (themeIndex === -1) return false
    
    data.themes[themeIndex].isActive = true
    data.themes[themeIndex].updatedAt = new Date().toISOString()
    
    this.saveData(data)
    return true
  }

  async deleteTheme(themeId: string): Promise<boolean> {
    const data = this.loadData()
    const themeIndex = data.themes.findIndex((t: DatabaseTheme) => t.id === themeId)
    
    if (themeIndex === -1) return false
    
    data.themes.splice(themeIndex, 1)
    this.saveData(data)
    return true
  }

  // Chat Sessions CRUD
  async createChatSession(sessionId: string, messages: any[]): Promise<void> {
    const data = this.loadData()
    const now = new Date().toISOString()
    
    const newSession: DatabaseChatSession = {
      id: sessionId,
      messages,
      isActive: true,
      createdAt: now,
      updatedAt: now
    }
    
    // Remove existing session with same id
    data.chatSessions = data.chatSessions.filter((s: DatabaseChatSession) => s.id !== sessionId)
    data.chatSessions.push(newSession)
    
    this.saveData(data)
  }

  async getChatSession(sessionId: string): Promise<DatabaseChatSession | null> {
    const data = this.loadData()
    return data.chatSessions.find((s: DatabaseChatSession) => s.id === sessionId) || null
  }

  async updateChatSession(sessionId: string, messages: any[]): Promise<void> {
    const data = this.loadData()
    const sessionIndex = data.chatSessions.findIndex((s: DatabaseChatSession) => s.id === sessionId)
    
    if (sessionIndex === -1) {
      await this.createChatSession(sessionId, messages)
      return
    }
    
    data.chatSessions[sessionIndex].messages = messages
    data.chatSessions[sessionIndex].updatedAt = new Date().toISOString()
    
    this.saveData(data)
  }

  async getActiveChatSessions(): Promise<DatabaseChatSession[]> {
    const data = this.loadData()
    return data.chatSessions
      .filter((s: DatabaseChatSession) => s.isActive)
      .sort((a: DatabaseChatSession, b: DatabaseChatSession) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
  }

  // Initialize with sample data if empty
  async initializeSampleData(): Promise<void> {
    const data = this.loadData()
    
    // Only initialize if no data exists
    if (data.projects.length === 0) {
      const sampleProjects = [
        {
          id: 'proj_1',
          title: 'E-Commerce Platform',
          description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB',
          image: '/project1.jpg',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          githubUrl: 'https://github.com/example/ecommerce',
          liveUrl: 'https://ecommerce.example.com',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      data.projects = sampleProjects
    }
    
    if (data.adminUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const sampleAdmin = {
        id: 'admin_1',
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        createdAt: new Date().toISOString()
      }
      data.adminUsers = [sampleAdmin]
    }
    
    if (data.websiteSettings.length === 0) {
      const sampleSettings = {
        id: 'settings_1',
        profile: {
          name: 'Sam',
          title: 'Cybersecurity Expert & Full-Stack Developer',
          bio: 'Passionate cybersecurity professional with expertise in vulnerability assessment, penetration testing, and secure web development.',
          location: 'Kaunas, Lithuania',
          email: 'shubham@example.com',
          phone: '+370-612-34567',
          profileImage: '/hero-img.jpeg',
          coverImage: '/hero-img.jpeg'
        },
        experience: [],
        skills: [],
        socialLinks: [],
        personalInterests: [],
        musicTracks: [],
        contactInfo: [],
        updatedAt: new Date().toISOString()
      }
      data.websiteSettings = [sampleSettings]
    }
    
    this.saveData(data)
    console.log('✅ Sample data initialized')
  }
}

// Export singleton instance
export const jsonDatabaseService = new JsonDatabaseService()

