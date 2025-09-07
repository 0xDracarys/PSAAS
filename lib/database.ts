import { Database } from 'sqlite3'
import { promisify } from 'util'
import path from 'path'

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
  profile: string // JSON string
  experience: string // JSON string
  skills: string // JSON string
  socialLinks: string // JSON string
  personalInterests: string // JSON string
  musicTracks: string // JSON string
  contactInfo: string // JSON string
  updatedAt: string
}

export class DatabaseService {
  private db: Database | null = null
  private dbPath: string

  constructor() {
    this.dbPath = path.join(process.cwd(), 'data', 'portfolio.db')
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err)
          reject(err)
          return
        }
        console.log('✅ Connected to SQLite database')
        this.createTables().then(resolve).catch(reject)
      })
    })
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const run = promisify(this.db.run.bind(this.db))

    try {
      // Projects table
      await run(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          technologies TEXT NOT NULL,
          githubUrl TEXT,
          liveUrl TEXT,
          isActive BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Client requests table
      await run(`
        CREATE TABLE IF NOT EXISTS client_requests (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          company TEXT,
          projectType TEXT NOT NULL,
          budget TEXT NOT NULL,
          timeline TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Admin users table
      await run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          passwordHash TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Website settings table
      await run(`
        CREATE TABLE IF NOT EXISTS website_settings (
          id TEXT PRIMARY KEY,
          profile TEXT NOT NULL,
          experience TEXT NOT NULL,
          skills TEXT NOT NULL,
          socialLinks TEXT NOT NULL,
          personalInterests TEXT NOT NULL,
          musicTracks TEXT NOT NULL,
          contactInfo TEXT NOT NULL,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Themes table
      await run(`
        CREATE TABLE IF NOT EXISTS themes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          isActive BOOLEAN DEFAULT 0,
          settings TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Chat sessions table
      await run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id TEXT PRIMARY KEY,
          messages TEXT NOT NULL,
          isActive BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('✅ Database tables created successfully')
    } catch (error) {
      console.error('Error creating tables:', error)
      throw error
    }
  }

  // Projects CRUD
  async createProject(project: Omit<DatabaseProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const id = `proj_${Date.now()}`
    await run(
      `INSERT INTO projects (id, title, description, image, technologies, githubUrl, liveUrl, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        project.title,
        project.description,
        project.image,
        JSON.stringify(project.technologies),
        project.githubUrl || null,
        project.liveUrl || null,
        project.isActive ? 1 : 0
      ]
    )
    return id
  }

  async getProjects(activeOnly = false): Promise<DatabaseProject[]> {
    if (!this.db) await this.init()
    const all = promisify(this.db!.all.bind(this.db!))
    
    const query = activeOnly 
      ? 'SELECT * FROM projects WHERE isActive = 1 ORDER BY createdAt DESC'
      : 'SELECT * FROM projects ORDER BY createdAt DESC'
    
    const rows = await all(query) as any[]
    return rows.map(row => ({
      ...row,
      technologies: JSON.parse(row.technologies),
      isActive: Boolean(row.isActive)
    }))
  }

  async updateProject(id: string, updates: Partial<DatabaseProject>): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const setClause = []
    const values = []
    
    if (updates.title) {
      setClause.push('title = ?')
      values.push(updates.title)
    }
    if (updates.description) {
      setClause.push('description = ?')
      values.push(updates.description)
    }
    if (updates.image) {
      setClause.push('image = ?')
      values.push(updates.image)
    }
    if (updates.technologies) {
      setClause.push('technologies = ?')
      values.push(JSON.stringify(updates.technologies))
    }
    if (updates.githubUrl !== undefined) {
      setClause.push('githubUrl = ?')
      values.push(updates.githubUrl)
    }
    if (updates.liveUrl !== undefined) {
      setClause.push('liveUrl = ?')
      values.push(updates.liveUrl)
    }
    if (updates.isActive !== undefined) {
      setClause.push('isActive = ?')
      values.push(updates.isActive ? 1 : 0)
    }
    
    setClause.push('updatedAt = CURRENT_TIMESTAMP')
    values.push(id)
    
    const result = await run(
      `UPDATE projects SET ${setClause.join(', ')} WHERE id = ?`,
      values
    )
    
    return (result as any).changes > 0
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const result = await run('DELETE FROM projects WHERE id = ?', [id])
    return (result as any).changes > 0
  }

  // Client Requests CRUD
  async createClientRequest(request: Omit<DatabaseClientRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const id = `req_${Date.now()}`
    await run(
      `INSERT INTO client_requests (id, name, email, company, projectType, budget, timeline, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        request.name,
        request.email,
        request.company || null,
        request.projectType,
        request.budget,
        request.timeline,
        request.description,
        request.status
      ]
    )
    return id
  }

  async getClientRequests(limit = 50, skip = 0): Promise<DatabaseClientRequest[]> {
    if (!this.db) await this.init()
    const all = promisify(this.db!.all.bind(this.db!))
    
    const rows = await all(
      'SELECT * FROM client_requests ORDER BY createdAt DESC LIMIT ? OFFSET ?',
      [limit, skip]
    ) as any[]
    
    return rows
  }

  async updateClientRequestStatus(id: string, status: string): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const result = await run(
      'UPDATE client_requests SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    )
    
    return (result as any).changes > 0
  }

  // Website Settings CRUD
  async getWebsiteSettings(): Promise<any | null> {
    if (!this.db) await this.init()
    const get = promisify(this.db!.get.bind(this.db!))
    
    const row = await get('SELECT * FROM website_settings LIMIT 1') as any
    if (!row) return null
    
    return {
      _id: row.id,
      profile: JSON.parse(row.profile),
      experience: JSON.parse(row.experience),
      skills: JSON.parse(row.skills),
      socialLinks: JSON.parse(row.socialLinks),
      personalInterests: JSON.parse(row.personalInterests),
      musicTracks: JSON.parse(row.musicTracks),
      contactInfo: JSON.parse(row.contactInfo),
      updatedAt: row.updatedAt
    }
  }

  async updateWebsiteSettings(settings: any): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const existing = await this.getWebsiteSettings()
    
    if (existing) {
      const result = await run(
        `UPDATE website_settings SET 
         profile = ?, experience = ?, skills = ?, socialLinks = ?, 
         personalInterests = ?, musicTracks = ?, contactInfo = ?, 
         updatedAt = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          JSON.stringify(settings.profile || {}),
          JSON.stringify(settings.experience || []),
          JSON.stringify(settings.skills || []),
          JSON.stringify(settings.socialLinks || []),
          JSON.stringify(settings.personalInterests || []),
          JSON.stringify(settings.musicTracks || []),
          JSON.stringify(settings.contactInfo || []),
          existing._id
        ]
      )
      return (result as any).changes > 0
    } else {
      const id = 'settings_1'
      const result = await run(
        `INSERT INTO website_settings (id, profile, experience, skills, socialLinks, personalInterests, musicTracks, contactInfo) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          JSON.stringify(settings.profile || {}),
          JSON.stringify(settings.experience || []),
          JSON.stringify(settings.skills || []),
          JSON.stringify(settings.socialLinks || []),
          JSON.stringify(settings.personalInterests || []),
          JSON.stringify(settings.musicTracks || []),
          JSON.stringify(settings.contactInfo || [])
        ]
      )
      return (result as any).changes > 0
    }
  }

  // Admin Users CRUD
  async createAdminUser(user: Omit<DatabaseAdminUser, 'id' | 'createdAt'>): Promise<string> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const id = `admin_${Date.now()}`
    await run(
      'INSERT INTO admin_users (id, username, email, passwordHash) VALUES (?, ?, ?, ?)',
      [id, user.username, user.email, user.passwordHash]
    )
    return id
  }

  async getAdminUserByUsername(username: string): Promise<DatabaseAdminUser | null> {
    if (!this.db) await this.init()
    const get = promisify(this.db!.get.bind(this.db!))
    
    const row = await get('SELECT * FROM admin_users WHERE username = ?', [username]) as any
    return row || null
  }

  // Themes CRUD
  async createTheme(theme: any): Promise<string> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const id = theme._id || `theme_${Date.now()}`
    await run(
      'INSERT OR REPLACE INTO themes (id, name, isActive, settings) VALUES (?, ?, ?, ?)',
      [id, theme.name, theme.isActive ? 1 : 0, JSON.stringify(theme)]
    )
    return id
  }

  async getThemes(): Promise<any[]> {
    if (!this.db) await this.init()
    const all = promisify(this.db!.all.bind(this.db!))
    
    const rows = await all('SELECT * FROM themes ORDER BY createdAt DESC') as any[]
    return rows.map(row => ({
      ...JSON.parse(row.settings),
      isActive: Boolean(row.isActive)
    }))
  }

  async activateTheme(themeId: string): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    // Deactivate all themes first
    await run('UPDATE themes SET isActive = 0')
    
    // Activate the selected theme
    const result = await run('UPDATE themes SET isActive = 1 WHERE id = ?', [themeId])
    return (result as any).changes > 0
  }

  async deleteTheme(themeId: string): Promise<boolean> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    const result = await run('DELETE FROM themes WHERE id = ?', [themeId])
    return (result as any).changes > 0
  }

  // Chat Sessions CRUD
  async createChatSession(sessionId: string, messages: any[]): Promise<void> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    await run(
      'INSERT OR REPLACE INTO chat_sessions (id, messages, isActive) VALUES (?, ?, ?)',
      [sessionId, JSON.stringify(messages), 1]
    )
  }

  async getChatSession(sessionId: string): Promise<any | null> {
    if (!this.db) await this.init()
    const get = promisify(this.db!.get.bind(this.db!))
    
    const row = await get('SELECT * FROM chat_sessions WHERE id = ?', [sessionId]) as any
    if (!row) return null
    
    return {
      id: row.id,
      messages: JSON.parse(row.messages),
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }

  async updateChatSession(sessionId: string, messages: any[]): Promise<void> {
    if (!this.db) await this.init()
    const run = promisify(this.db!.run.bind(this.db!))
    
    await run(
      'UPDATE chat_sessions SET messages = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(messages), sessionId]
    )
  }

  async getActiveChatSessions(): Promise<any[]> {
    if (!this.db) await this.init()
    const all = promisify(this.db!.all.bind(this.db!))
    
    const rows = await all('SELECT * FROM chat_sessions WHERE isActive = 1 ORDER BY updatedAt DESC') as any[]
    return rows.map(row => ({
      id: row.id,
      messages: JSON.parse(row.messages),
      isActive: Boolean(row.isActive),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }))
  }

  async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()

