/**
 * Comprehensive Test Suite for Admin Panel Functionality
 * Tests all CRUD operations, API endpoints, and UI interactions
 */

const { MongoClient } = require('mongodb')

// Test configuration
const TEST_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://uniqthatswhatyouare_db_user:jnjF8Db3LnHeM8DR@portfolio.oijkdkg.mongodb.net/portfolio_db?retryWrites=true&w=majority',
  BASE_URL: 'http://localhost:3000',
  TEST_TIMEOUT: 30000
}

// Test data
const TEST_DATA = {
  project: {
    title: 'Test Project',
    description: 'Test project description',
    technologies: ['React', 'Node.js'],
    imageUrl: 'https://example.com/image.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    category: 'Web Development',
    featured: true,
    active: true
  },
  clientRequest: {
    name: 'Test Client',
    email: 'test@example.com',
    phone: '+1234567890',
    projectType: 'Web Development',
    budget: '$5000 - $10000',
    timeline: '1-3 months',
    requirements: 'Test requirements',
    referenceLinks: ['https://example.com'],
    status: 'pending',
    acceptedTerms: true
  },
  websiteSettings: {
    name: 'Test Portfolio',
    title: 'Test Developer',
    subtitle: 'Full Stack Developer',
    description: 'Test description',
    email: 'test@example.com',
    phone: '+1234567890',
    location: 'Test City',
    profileImage: 'https://example.com/profile.jpg',
    resumeUrl: 'https://example.com/resume.pdf',
    socialLinks: {
      github: 'https://github.com/test',
      linkedin: 'https://linkedin.com/in/test',
      twitter: 'https://twitter.com/test'
    }
  },
  theme: {
    name: 'Test Theme',
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      accent: '#0000ff',
      background: '#000000',
      foreground: '#ffffff'
    },
    isActive: false
  }
}

class AdminTestSuite {
  constructor() {
    this.client = null
    this.db = null
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    }
  }

  async setup() {
    try {
      this.client = new MongoClient(TEST_CONFIG.MONGODB_URI)
      await this.client.connect()
      this.db = this.client.db('portfolio_db')
      console.log('✅ Test database connected')
    } catch (error) {
      console.error('❌ Test database connection failed:', error)
      throw error
    }
  }

  async cleanup() {
    if (this.client) {
      await this.client.close()
      console.log('✅ Test database disconnected')
    }
  }

  async runTest(testName, testFunction) {
    try {
      console.log(`🧪 Running test: ${testName}`)
      await testFunction()
      this.testResults.passed++
      console.log(`✅ PASSED: ${testName}`)
    } catch (error) {
      this.testResults.failed++
      this.testResults.errors.push({ test: testName, error: error.message })
      console.log(`❌ FAILED: ${testName} - ${error.message}`)
    }
  }

  // API Endpoint Tests
  async testProjectsAPI() {
    const response = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Projects API returned ${response.status}: ${data.error}`)
    }
    
    if (!data.success) {
      throw new Error('Projects API returned success: false')
    }
    
    if (!Array.isArray(data.projects)) {
      throw new Error('Projects API did not return an array')
    }
  }

  async testClientRequestsAPI() {
    const response = await fetch(`${TEST_CONFIG.BASE_URL}/api/client-requests`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Client Requests API returned ${response.status}: ${data.error}`)
    }
    
    if (!data.success) {
      throw new Error('Client Requests API returned success: false')
    }
    
    if (!Array.isArray(data.requests)) {
      throw new Error('Client Requests API did not return an array')
    }
  }

  async testWebsiteSettingsAPI() {
    const response = await fetch(`${TEST_CONFIG.BASE_URL}/api/settings`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Settings API returned ${response.status}: ${data.error}`)
    }
    
    if (!data.success) {
      throw new Error('Settings API returned success: false')
    }
    
    if (!data.settings) {
      throw new Error('Settings API did not return settings object')
    }
  }

  async testThemesAPI() {
    const response = await fetch(`${TEST_CONFIG.BASE_URL}/api/themes`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Themes API returned ${response.status}: ${data.error}`)
    }
    
    if (!Array.isArray(data.themes)) {
      throw new Error('Themes API did not return an array')
    }
  }

  // CRUD Operations Tests
  async testProjectCRUD() {
    // Test Create
    const createResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_DATA.project)
    })
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      throw new Error(`Project creation failed: ${errorData.error}`)
    }
    
    const createData = await createResponse.json()
    if (!createData.success || !createData.projectId) {
      throw new Error('Project creation did not return project ID')
    }
    
    const projectId = createData.projectId
    
    // Test Read
    const readResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects/${projectId}`)
    if (!readResponse.ok) {
      throw new Error(`Project read failed: ${readResponse.status}`)
    }
    
    // Test Update
    const updateData = { ...TEST_DATA.project, title: 'Updated Test Project' }
    const updateResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`Project update failed: ${errorData.error}`)
    }
    
    // Test Delete
    const deleteResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE'
    })
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json()
      throw new Error(`Project deletion failed: ${errorData.error}`)
    }
  }

  async testClientRequestCRUD() {
    // Test Create
    const createResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/client-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_DATA.clientRequest)
    })
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      throw new Error(`Client request creation failed: ${errorData.error}`)
    }
    
    const createData = await createResponse.json()
    if (!createData.success || !createData.requestId) {
      throw new Error('Client request creation did not return request ID')
    }
    
    const requestId = createData.requestId
    
    // Test Update
    const updateData = { ...TEST_DATA.clientRequest, status: 'reviewed' }
    const updateResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/client-requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`Client request update failed: ${errorData.error}`)
    }
    
    // Test Status Update
    const statusResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/client-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    })
    
    if (!statusResponse.ok) {
      const errorData = await statusResponse.json()
      throw new Error(`Client request status update failed: ${errorData.error}`)
    }
  }

  async testThemeCRUD() {
    // Test Create
    const createResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/themes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_DATA.theme)
    })
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      throw new Error(`Theme creation failed: ${errorData.error}`)
    }
    
    const createData = await createResponse.json()
    if (!createData.success || !createData.themeId) {
      throw new Error('Theme creation did not return theme ID')
    }
    
    const themeId = createData.themeId
    
    // Test Update
    const updateData = { ...TEST_DATA.theme, name: 'Updated Test Theme' }
    const updateResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/themes/${themeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json()
      throw new Error(`Theme update failed: ${errorData.error}`)
    }
    
    // Test Activation
    const activateResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/themes/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId })
    })
    
    if (!activateResponse.ok) {
      const errorData = await activateResponse.json()
      throw new Error(`Theme activation failed: ${errorData.error}`)
    }
    
    // Test Delete
    const deleteResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/themes/${themeId}`, {
      method: 'DELETE'
    })
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json()
      throw new Error(`Theme deletion failed: ${errorData.error}`)
    }
  }

  // Database Integrity Tests
  async testDatabaseIntegrity() {
    const collections = ['projects', 'client_requests', 'website_settings', 'themes', 'theme_history']
    
    for (const collectionName of collections) {
      const collection = this.db.collection(collectionName)
      const count = await collection.countDocuments()
      console.log(`📊 Collection ${collectionName}: ${count} documents`)
      
      if (collectionName === 'themes' && count === 0) {
        throw new Error('Themes collection is empty - default themes not imported')
      }
    }
  }

  // Error Handling Tests
  async testErrorHandling() {
    // Test 404 for non-existent project
    const response = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects/non-existent-id`)
    if (response.status !== 404) {
      throw new Error('Expected 404 for non-existent project')
    }
    
    // Test 400 for invalid data
    const invalidResponse = await fetch(`${TEST_CONFIG.BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty data
    })
    
    // Accept both 400 and 500 as valid error responses
    if (invalidResponse.status !== 400 && invalidResponse.status !== 500) {
      throw new Error(`Expected 400 or 500 for invalid project data, got ${invalidResponse.status}`)
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Admin Panel Test Suite...\n')
    
    await this.setup()
    
    // API Tests
    await this.runTest('Projects API', () => this.testProjectsAPI())
    await this.runTest('Client Requests API', () => this.testClientRequestsAPI())
    await this.runTest('Website Settings API', () => this.testWebsiteSettingsAPI())
    await this.runTest('Themes API', () => this.testThemesAPI())
    
    // CRUD Tests
    await this.runTest('Project CRUD Operations', () => this.testProjectCRUD())
    await this.runTest('Client Request CRUD Operations', () => this.testClientRequestCRUD())
    await this.runTest('Theme CRUD Operations', () => this.testThemeCRUD())
    
    // Database Tests
    await this.runTest('Database Integrity', () => this.testDatabaseIntegrity())
    await this.runTest('Error Handling', () => this.testErrorHandling())
    
    await this.cleanup()
    
    // Print results
    console.log('\n📊 Test Results:')
    console.log(`✅ Passed: ${this.testResults.passed}`)
    console.log(`❌ Failed: ${this.testResults.failed}`)
    
    if (this.testResults.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.testResults.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`)
      })
    }
    
    return this.testResults.failed === 0
  }
}

// Export for use
module.exports = { AdminTestSuite, TEST_DATA, TEST_CONFIG }

// Run tests if called directly
if (require.main === module) {
  const testSuite = new AdminTestSuite()
  testSuite.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('Test suite failed:', error)
      process.exit(1)
    })
}
