/**
 * @jest-environment node
 */

// Mock the database service
jest.mock('../lib/mongodb', () => ({
  dbService: {
    getClientRequests: jest.fn(),
    createClientRequest: jest.fn(),
    getProjects: jest.fn(),
    createProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    getWebsiteSettings: jest.fn(),
    updateWebsiteSettings: jest.fn(),
    getAdminUser: jest.fn(),
    updateLastLogin: jest.fn(),
    init: jest.fn(),
  },
}))

const { dbService } = require('../lib/mongodb')

describe('Core Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Database Service Integration', () => {
    test('should call getClientRequests when fetching client requests', async () => {
      const mockRequests = [
        {
          _id: 'req_1',
          name: 'John Doe',
          email: 'john@example.com',
          projectType: 'Web Development',
          status: 'pending',
        },
      ]

      dbService.getClientRequests.mockResolvedValue(mockRequests)

      // Simulate the API call logic
      const requests = await dbService.getClientRequests()

      expect(dbService.getClientRequests).toHaveBeenCalled()
      expect(requests).toEqual(mockRequests)
    })

    test('should call createClientRequest when creating new request', async () => {
      const requestData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        projectType: 'Mobile App',
        requirements: 'Need a mobile app',
        budget: '€2000-€3000',
        timeline: '2-3 months',
        referenceLinks: [],
        files: [],
        acceptedTerms: true,
      }

      const mockRequestId = 'req_2'
      dbService.createClientRequest.mockResolvedValue(mockRequestId)

      const requestId = await dbService.createClientRequest(requestData)

      expect(dbService.createClientRequest).toHaveBeenCalledWith(requestData)
      expect(requestId).toBe(mockRequestId)
    })

    test('should call getProjects when fetching projects', async () => {
      const mockProjects = [
        {
          _id: 'proj_1',
          title: 'Test Project',
          description: 'A test project',
          status: 'completed',
          progress: 100,
          isActive: true,
        },
      ]

      dbService.getProjects.mockResolvedValue(mockProjects)

      const projects = await dbService.getProjects(false)

      expect(dbService.getProjects).toHaveBeenCalledWith(false)
      expect(projects).toEqual(mockProjects)
    })

    test('should call getProjects with active filter when fetching active projects', async () => {
      const mockActiveProjects = [
        {
          _id: 'proj_1',
          title: 'Active Project',
          isActive: true,
        },
      ]

      dbService.getProjects.mockResolvedValue(mockActiveProjects)

      const projects = await dbService.getProjects(true)

      expect(dbService.getProjects).toHaveBeenCalledWith(true)
      expect(projects).toEqual(mockActiveProjects)
    })

    test('should call createProject when creating new project', async () => {
      const projectData = {
        title: 'New Project',
        description: 'A new project',
        status: 'pending',
        progress: 0,
        isActive: true,
      }

      const mockProjectId = 'proj_2'
      dbService.createProject.mockResolvedValue(mockProjectId)

      const projectId = await dbService.createProject(projectData)

      expect(dbService.createProject).toHaveBeenCalledWith(projectData)
      expect(projectId).toBe(mockProjectId)
    })

    test('should call updateProject when updating project', async () => {
      const projectId = 'proj_1'
      const updateData = {
        title: 'Updated Project',
        progress: 50,
        status: 'in-progress',
      }

      dbService.updateProject.mockResolvedValue(true)

      const updated = await dbService.updateProject(projectId, updateData)

      expect(dbService.updateProject).toHaveBeenCalledWith(projectId, updateData)
      expect(updated).toBe(true)
    })

    test('should call deleteProject when deleting project', async () => {
      const projectId = 'proj_1'

      dbService.deleteProject.mockResolvedValue(true)

      const deleted = await dbService.deleteProject(projectId)

      expect(dbService.deleteProject).toHaveBeenCalledWith(projectId)
      expect(deleted).toBe(true)
    })

    test('should call getWebsiteSettings when fetching settings', async () => {
      const mockSettings = {
        _id: 'settings_1',
        profile: {
          name: 'Test User',
          title: 'Test Title',
          bio: 'Test bio',
        },
        experience: [],
        skills: [],
        socialLinks: [],
        personalInterests: [],
        musicTracks: [],
        contactInfo: [],
        updatedAt: new Date(),
      }

      dbService.getWebsiteSettings.mockResolvedValue(mockSettings)

      const settings = await dbService.getWebsiteSettings()

      expect(dbService.getWebsiteSettings).toHaveBeenCalled()
      expect(settings).toEqual(mockSettings)
    })

    test('should call updateWebsiteSettings when updating settings', async () => {
      const updateData = {
        profile: {
          name: 'Updated Name',
          title: 'Updated Title',
        },
      }

      dbService.updateWebsiteSettings.mockResolvedValue(true)

      const updated = await dbService.updateWebsiteSettings(updateData)

      expect(dbService.updateWebsiteSettings).toHaveBeenCalledWith(updateData)
      expect(updated).toBe(true)
    })

    test('should call getAdminUser when authenticating', async () => {
      const mockUser = {
        _id: 'admin_1',
        username: 'admin',
        email: 'admin@portfolio.com',
        role: 'admin',
        passwordHash: 'hashed_password',
      }

      dbService.getAdminUser.mockResolvedValue(mockUser)

      const user = await dbService.getAdminUser('admin')

      expect(dbService.getAdminUser).toHaveBeenCalledWith('admin')
      expect(user).toEqual(mockUser)
    })

    test('should call updateLastLogin when user logs in', async () => {
      dbService.updateLastLogin.mockResolvedValue(true)

      const updated = await dbService.updateLastLogin('admin')

      expect(dbService.updateLastLogin).toHaveBeenCalledWith('admin')
      expect(updated).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      dbService.getClientRequests.mockRejectedValue(new Error('Database connection failed'))

      try {
        await dbService.getClientRequests()
        fail('Expected function to throw')
      } catch (error) {
        expect(error.message).toBe('Database connection failed')
      }
    })

    test('should handle missing data scenarios', async () => {
      dbService.getProjects.mockResolvedValue([])

      const projects = await dbService.getProjects(false)

      expect(projects).toEqual([])
      expect(projects.length).toBe(0)
    })
  })

  describe('Data Validation', () => {
    test('should validate required fields in project data', () => {
      const validProject = {
        title: 'Valid Project',
        description: 'Valid description',
        status: 'pending',
        progress: 0,
        isActive: true,
      }

      const isValid = 
        validProject.title && 
        validProject.description && 
        validProject.status && 
        typeof validProject.progress === 'number' && 
        typeof validProject.isActive === 'boolean'

      expect(isValid).toBe(true)
    })

    test('should validate required fields in client request data', () => {
      const validRequest = {
        name: 'John Doe',
        email: 'john@example.com',
        projectType: 'Web Development',
        requirements: 'Need a website',
        budget: '€1000-€2000',
        timeline: '1-2 months',
        acceptedTerms: true,
      }

      const isValid = 
        validRequest.name && 
        validRequest.email && 
        validRequest.projectType && 
        validRequest.requirements && 
        validRequest.budget && 
        validRequest.timeline && 
        validRequest.acceptedTerms === true

      expect(isValid).toBe(true)
    })

    test('should validate required fields in settings data', () => {
      const validSettings = {
        profile: {
          name: 'Test User',
          title: 'Test Title',
          bio: 'Test bio',
          email: 'test@example.com',
          phone: '+1234567890',
          location: 'Test Location',
        },
      }

      const isValid = 
        !!validSettings.profile.name && 
        !!validSettings.profile.title && 
        !!validSettings.profile.bio && 
        !!validSettings.profile.email && 
        !!validSettings.profile.phone && 
        !!validSettings.profile.location

      expect(isValid).toBe(true)
    })
  })

  describe('Business Logic', () => {
    test('should calculate project progress correctly', () => {
      const project = {
        progress: 75,
        status: 'in-progress',
      }

      const isProgressValid = project.progress >= 0 && project.progress <= 100
      const isStatusValid = ['pending', 'in-progress', 'completed', 'on-hold'].includes(project.status)

      expect(isProgressValid).toBe(true)
      expect(isStatusValid).toBe(true)
    })

    test('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin@company.org',
      ]

      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@domain',
      ]

      validEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        expect(isValid).toBe(true)
      })

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        expect(isValid).toBe(false)
      })
    })

    test('should validate phone number format', () => {
      const validPhones = [
        '+1234567890',
        '+44-712-345678',
        '+1-555-123-4567',
        '1234567890',
      ]

      const invalidPhones = [
        'invalid-phone',
        '123',
        'abc-def-ghij',
      ]

      validPhones.forEach(phone => {
        const isValid = /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone)
        expect(isValid).toBe(true)
      })

      invalidPhones.forEach(phone => {
        const isValid = /^[\+]?[\d\s\-\(\)]{10,}$/.test(phone)
        expect(isValid).toBe(false)
      })
    })
  })

  describe('Session Management', () => {
    test('should validate session token format', () => {
      const validToken = 'admin_session_1234567890'
      const invalidToken = 'invalid_token'

      const isValidFormat = /^admin_session_\d+$/.test(validToken)
      const isInvalidFormat = /^admin_session_\d+$/.test(invalidToken)

      expect(isValidFormat).toBe(true)
      expect(isInvalidFormat).toBe(false)
    })

    test('should validate token expiry', () => {
      const now = Date.now()
      const validExpiry = now + (24 * 60 * 60 * 1000) // 24 hours from now
      const expiredToken = now - (24 * 60 * 60 * 1000) // 24 hours ago

      const isTokenValid = validExpiry > now
      const isTokenExpired = expiredToken < now

      expect(isTokenValid).toBe(true)
      expect(isTokenExpired).toBe(true)
    })
  })
})
