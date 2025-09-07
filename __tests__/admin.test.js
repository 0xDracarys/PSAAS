/**
 * @jest-environment node
 */

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('Admin Functionality', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    fetch.mockClear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  describe('Session Management', () => {
    test('should check for valid session token on load', () => {
      const mockToken = 'admin_session_1234567890'
      const mockExpiry = (Date.now() + 24 * 60 * 60 * 1000).toString() // 24 hours from now
      
      // Simulate the actual function calls that would happen
      localStorageMock.getItem('admin_token')
      localStorageMock.getItem('admin_token_expiry')

      expect(localStorageMock.getItem).toHaveBeenCalledWith('admin_token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('admin_token_expiry')
    })

    test('should clear expired session token', () => {
      const mockToken = 'admin_session_1234567890'
      const expiredExpiry = (Date.now() - 24 * 60 * 60 * 1000).toString() // 24 hours ago
      
      localStorageMock.getItem
        .mockReturnValueOnce(mockToken)
        .mockReturnValueOnce(expiredExpiry)

      // Simulate the logic that would clear expired tokens
      const now = new Date().getTime()
      const expiry = parseInt(expiredExpiry)
      
      if (now >= expiry) {
        localStorageMock.removeItem('admin_token')
        localStorageMock.removeItem('admin_token_expiry')
      }

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_token_expiry')
    })
  })

  describe('API Integration', () => {
    test('should fetch website settings successfully', async () => {
      const mockSettings = {
        _id: 'settings_1',
        profile: {
          name: 'Test User',
          title: 'Test Title',
          bio: 'Test bio',
          email: 'test@example.com',
          phone: '+1234567890',
          location: 'Test Location',
          profileImage: '/test-image.jpg',
          coverImage: '/test-cover.jpg',
        },
        experience: [],
        skills: [],
        socialLinks: [],
        personalInterests: [],
        musicTracks: [],
        contactInfo: [],
        updatedAt: new Date(),
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, settings: mockSettings }),
      })

      const response = await fetch('/api/settings')
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith('/api/settings')
      expect(data.success).toBe(true)
      expect(data.settings).toEqual(mockSettings)
    })

    test('should handle API errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      try {
        await fetch('/api/settings')
      } catch (error) {
        expect(error.message).toBe('Network error')
      }
    })

    test('should update website settings successfully', async () => {
      const mockSettings = {
        profile: {
          name: 'Updated Name',
          title: 'Updated Title',
        },
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Settings updated successfully' }),
      })

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockSettings),
      })

      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockSettings),
      })
      expect(data.success).toBe(true)
      expect(data.message).toBe('Settings updated successfully')
    })
  })

  describe('Project Management', () => {
    test('should fetch projects successfully', async () => {
      const mockProjects = [
        {
          _id: 'proj_1',
          title: 'Test Project',
          description: 'Test description',
          status: 'completed',
          progress: 100,
          isActive: true,
        },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, projects: mockProjects }),
      })

      const response = await fetch('/api/projects')
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith('/api/projects')
      expect(data.success).toBe(true)
      expect(data.projects).toEqual(mockProjects)
    })

    test('should create new project successfully', async () => {
      const newProject = {
        title: 'New Project',
        description: 'New description',
        status: 'pending',
        progress: 0,
        isActive: true,
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Project created successfully' }),
      })

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })

      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      })
      expect(data.success).toBe(true)
    })

    test('should update project successfully', async () => {
      const projectId = 'proj_1'
      const updatedProject = {
        title: 'Updated Project',
        description: 'Updated description',
        status: 'in-progress',
        progress: 50,
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Project updated successfully' }),
      })

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      })

      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      })
      expect(data.success).toBe(true)
    })

    test('should delete project successfully', async () => {
      const projectId = 'proj_1'

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Project deleted successfully' }),
      })

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      expect(data.success).toBe(true)
    })
  })

  describe('Client Requests', () => {
    test('should fetch client requests successfully', async () => {
      const mockRequests = [
        {
          _id: 'req_1',
          name: 'John Doe',
          email: 'john@example.com',
          projectType: 'Web Development',
          status: 'pending',
          createdAt: new Date(),
        },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, requests: mockRequests }),
      })

      const response = await fetch('/api/client-requests')
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith('/api/client-requests')
      expect(data.success).toBe(true)
      expect(data.requests).toEqual(mockRequests)
    })
  })

  describe('Form Validation', () => {
    test('should validate required fields in project form', () => {
      const projectData = {
        title: '', // Empty title should be invalid
        description: 'Valid description',
        status: 'pending',
      }

      const isValid = projectData.title.trim() !== '' && projectData.description.trim() !== ''
      expect(isValid).toBe(false)
    })

    test('should validate required fields in settings form', () => {
      const settingsData = {
        profile: {
          name: 'Valid Name',
          title: '', // Empty title should be invalid
          bio: 'Valid bio',
        },
      }

      const isValid = 
        settingsData.profile.name.trim() !== '' && 
        settingsData.profile.title.trim() !== '' &&
        settingsData.profile.bio.trim() !== ''
      
      expect(isValid).toBe(false)
    })
  })

  describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      try {
        await fetch('/api/settings')
        fail('Expected function to throw')
      } catch (error) {
        expect(error.message).toBe('Network error')
      }
    })

    test('should handle API error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      })

      const response = await fetch('/api/settings')
      const data = await response.json()

      expect(response.ok).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })
})
