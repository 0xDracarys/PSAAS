import { jsonDatabaseService } from "./json-database"

// Initialize the database service
export async function initializeDatabaseService() {
  await jsonDatabaseService.initializeSampleData()
  return jsonDatabaseService
}

// Export the database service for use in API routes
export const dbService = {
  // Projects
  async createProject(project: any) {
    const service = await initializeDatabaseService()
    return await service.createProject(project)
  },

  async getProjects(activeOnly = false) {
    const service = await initializeDatabaseService()
    return await service.getProjects(activeOnly)
  },

  async updateProject(id: string, updates: any) {
    const service = await initializeDatabaseService()
    return await service.updateProject(id, updates)
  },

  async deleteProject(id: string) {
    const service = await initializeDatabaseService()
    return await service.deleteProject(id)
  },

  // Client Requests
  async createClientRequest(request: any) {
    const service = await initializeDatabaseService()
    return await service.createClientRequest(request)
  },

  async getClientRequests(limit = 50, skip = 0) {
    const service = await initializeDatabaseService()
    return await service.getClientRequests(limit, skip)
  },

  async updateClientRequestStatus(id: string, status: string) {
    const service = await initializeDatabaseService()
    return await service.updateClientRequestStatus(id, status)
  },

  // Website Settings
  async getWebsiteSettings() {
    const service = await initializeDatabaseService()
    return await service.getWebsiteSettings()
  },

  async updateWebsiteSettings(settings: any) {
    const service = await initializeDatabaseService()
    return await service.updateWebsiteSettings(settings)
  },

  // Admin Users
  async createAdminUser(user: any) {
    const service = await initializeDatabaseService()
    return await service.createAdminUser(user)
  },

  async getAdminUserByUsername(username: string) {
    const service = await initializeDatabaseService()
    return await service.getAdminUserByUsername(username)
  },

  async verifyAdminPassword(username: string, password: string) {
    const service = await initializeDatabaseService()
    return await service.verifyAdminPassword(username, password)
  },

  // Themes
  async createTheme(theme: any) {
    const service = await initializeDatabaseService()
    return await service.createTheme(theme)
  },

  async getThemes() {
    const service = await initializeDatabaseService()
    return await service.getThemes()
  },

  async activateTheme(themeId: string) {
    const service = await initializeDatabaseService()
    return await service.activateTheme(themeId)
  },

  async deleteTheme(themeId: string) {
    const service = await initializeDatabaseService()
    return await service.deleteTheme(themeId)
  },

  // Chat Sessions
  async createChatSession(sessionId: string, messages: any[]) {
    const service = await initializeDatabaseService()
    return await service.createChatSession(sessionId, messages)
  },

  async getChatSession(sessionId: string) {
    const service = await initializeDatabaseService()
    return await service.getChatSession(sessionId)
  },

  async updateChatSession(sessionId: string, messages: any[]) {
    const service = await initializeDatabaseService()
    return await service.updateChatSession(sessionId, messages)
  },

  async getActiveChatSessions() {
    const service = await initializeDatabaseService()
    return await service.getActiveChatSessions()
  }
}

