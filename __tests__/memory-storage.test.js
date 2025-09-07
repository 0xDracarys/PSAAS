/**
 * @jest-environment node
 */

// Mock the memory storage module
const { MemoryDatabaseService } = require('../lib/memory-storage')

describe('Memory Storage Service', () => {
  let dbService

  beforeEach(() => {
    dbService = new MemoryDatabaseService()
  })

  describe('Client Requests', () => {
    test('should create a new client request', async () => {
      const requestData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        projectType: 'Web Development',
        requirements: 'Need a website',
        budget: '€1000-€2000',
        timeline: '1-2 months',
        referenceLinks: ['https://example.com'],
        files: [],
        acceptedTerms: true,
        paymentTerms: '50% upfront',
      }

      const requestId = await dbService.createClientRequest(requestData)

      expect(requestId).toBeDefined()
      expect(typeof requestId).toBe('string')
    })

    test('should get all client requests', async () => {
      const requests = await dbService.getClientRequests()

      expect(Array.isArray(requests)).toBe(true)
      expect(requests.length).toBeGreaterThan(0)
    })

    test('should update client request status', async () => {
      // First create a request
      const requestData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        projectType: 'Mobile App',
        requirements: 'Need a mobile app',
        budget: '€2000-€3000',
        timeline: '2-3 months',
        referenceLinks: [],
        files: [],
        acceptedTerms: true,
        paymentTerms: '50% upfront',
      }

      const requestId = await dbService.createClientRequest(requestData)
      const updated = await dbService.updateClientRequestStatus(requestId, 'approved')

      expect(updated).toBe(true)
    })
  })

  describe('Projects', () => {
    test('should create a new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'A test project',
        image: '/test-image.jpg',
        tags: ['React', 'Node.js'],
        github: 'https://github.com/test/project',
        demo: 'https://demo.example.com',
        features: ['Feature 1', 'Feature 2'],
        isActive: true,
        client: 'Test Client',
        status: 'pending',
        budget: 5000,
        startDate: '2024-01-01',
        endDate: '2024-02-01',
        progress: 0,
      }

      const projectId = await dbService.createProject(projectData)

      expect(projectId).toBeDefined()
      expect(typeof projectId).toBe('string')
    })

    test('should get all projects', async () => {
      const projects = await dbService.getProjects()

      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)
    })

    test('should get active projects only', async () => {
      const activeProjects = await dbService.getProjects(true)

      expect(Array.isArray(activeProjects)).toBe(true)
      activeProjects.forEach(project => {
        expect(project.isActive).toBe(true)
      })
    })

    test('should update project', async () => {
      // First create a project
      const projectData = {
        title: 'Original Title',
        description: 'Original description',
        isActive: true,
        status: 'pending',
        progress: 0,
      }

      const projectId = await dbService.createProject(projectData)
      
      // Update the project
      const updateData = {
        title: 'Updated Title',
        progress: 50,
        status: 'in-progress',
      }

      const updated = await dbService.updateProject(projectId, updateData)

      expect(updated).toBe(true)
    })

    test('should delete project', async () => {
      // First create a project
      const projectData = {
        title: 'Project to Delete',
        description: 'This project will be deleted',
        isActive: true,
        status: 'pending',
        progress: 0,
      }

      const projectId = await dbService.createProject(projectData)
      const deleted = await dbService.deleteProject(projectId)

      expect(deleted).toBe(true)
    })
  })

  describe('Admin Users', () => {
    test('should get admin user by username', async () => {
      const user = await dbService.getAdminUser('admin')

      expect(user).toBeDefined()
      expect(user.username).toBe('admin')
      expect(user.role).toBe('admin')
    })

    test('should return null for non-existent user', async () => {
      const user = await dbService.getAdminUser('nonexistent')

      expect(user).toBeNull()
    })

    test('should update last login', async () => {
      const updated = await dbService.updateLastLogin('admin')

      expect(updated).toBe(true)
    })
  })

  describe('Website Settings', () => {
    test('should get website settings', async () => {
      const settings = await dbService.getWebsiteSettings()

      expect(settings).toBeDefined()
      expect(settings._id).toBe('settings_1')
      expect(settings.profile).toBeDefined()
      expect(settings.experience).toBeDefined()
      expect(settings.skills).toBeDefined()
    })

    test('should update website settings', async () => {
      const updateData = {
        profile: {
          name: 'Updated Name',
          title: 'Updated Title',
          bio: 'Updated bio',
          email: 'updated@example.com',
          phone: '+9876543210',
          location: 'Updated Location',
          profileImage: '/updated-image.jpg',
          coverImage: '/updated-cover.jpg',
        },
      }

      const updated = await dbService.updateWebsiteSettings(updateData)

      expect(updated).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid project ID in update', async () => {
      const updateData = { title: 'Updated Title' }
      const updated = await dbService.updateProject('invalid-id', updateData)

      expect(updated).toBe(false)
    })

    test('should handle invalid project ID in delete', async () => {
      const deleted = await dbService.deleteProject('invalid-id')

      expect(deleted).toBe(false)
    })

    test('should handle invalid request ID in status update', async () => {
      const updated = await dbService.updateClientRequestStatus('invalid-id', 'approved')

      expect(updated).toBe(false)
    })
  })
})
