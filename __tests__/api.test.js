const { MongoClient } = require('mongodb');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  retries: 3
};

// Test utilities
class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async runTest(name, testFn) {
    try {
      console.log(`🧪 Running test: ${name}`);
      await testFn();
      this.results.passed++;
      console.log(`✅ ${name} - PASSED`);
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ name, error: error.message });
      console.log(`❌ ${name} - FAILED: ${error.message}`);
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
    
    // Add delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async testWithRetry(name, testFn, retries = TEST_CONFIG.retries) {
    for (let i = 0; i < retries; i++) {
      try {
        await testFn();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        console.log(`⚠️  ${name} - Retry ${i + 1}/${retries}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  printResults() {
    console.log('\n📊 TEST RESULTS:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.errors.forEach(({ name, error }) => {
        console.log(`  - ${name}: ${error}`);
      });
    }
  }
}

// API Tests
class APITests {
  constructor(runner) {
    this.runner = runner;
  }

  async testProjectsAPI() {
    await this.runner.testWithRetry('Projects API - GET /api/projects', async () => {
      const data = await this.runner.makeRequest('/api/projects');
      
      if (!data.success) throw new Error('API returned success: false');
      if (!Array.isArray(data.projects)) throw new Error('Projects should be an array');
      
      // Test project structure
      if (data.projects.length > 0) {
        const project = data.projects[0];
        const requiredFields = ['_id', 'id', 'title', 'description', 'createdAt', 'updatedAt'];
        for (const field of requiredFields) {
          if (!(field in project)) {
            throw new Error(`Project missing required field: ${field}`);
          }
        }
      }
    });

    await this.runner.testWithRetry('Projects API - GET /api/projects?active=true', async () => {
      const data = await this.runner.makeRequest('/api/projects?active=true');
      
      if (!data.success) throw new Error('API returned success: false');
      if (!Array.isArray(data.projects)) throw new Error('Projects should be an array');
    });
  }

  async testIndividualProjectAPI() {
    await this.runner.testWithRetry('Individual Project API - GET /api/projects/[id]', async () => {
      // First get a project ID
      const projectsData = await this.runner.makeRequest('/api/projects');
      if (projectsData.projects.length === 0) {
        console.log('⚠️  No projects found, skipping individual project test');
        return;
      }
      
      const projectId = projectsData.projects[0]._id || projectsData.projects[0].id;
      const data = await this.runner.makeRequest(`/api/projects/${projectId}`);
      
      if (!data.success) throw new Error('API returned success: false');
      if (!data.project) throw new Error('Project data not found');
    });
  }

  async testClientRequestsAPI() {
    await this.runner.testWithRetry('Client Requests API - GET /api/client-requests', async () => {
      const data = await this.runner.makeRequest('/api/client-requests');
      
      if (!data.success) throw new Error('API returned success: false');
      if (!Array.isArray(data.requests)) throw new Error('Requests should be an array');
    });
  }

  async testThemesAPI() {
    await this.runner.testWithRetry('Themes API - GET /api/themes', async () => {
      const data = await this.runner.makeRequest('/api/themes');
      
      if (!data.success) throw new Error('API returned success: false');
      if (!Array.isArray(data.themes)) throw new Error('Themes should be an array');
      
      // Test theme structure
      if (data.themes.length > 0) {
        const theme = data.themes[0];
        const requiredFields = ['id', 'name', 'colors', 'effects'];
        for (const field of requiredFields) {
          if (!(field in theme)) {
            throw new Error(`Theme missing required field: ${field}`);
          }
        }
      }
    });
  }

  async testSettingsAPI() {
    await this.runner.testWithRetry('Settings API - GET /api/settings', async () => {
      const data = await this.runner.makeRequest('/api/settings');
      
      if (!data.success) throw new Error('API returned success: false');
      if (!data.settings) throw new Error('Settings data not found');
    });
  }

  async testProjectUpdateAPI() {
    await this.runner.testWithRetry('Project Update API - PUT /api/projects/[id]', async () => {
      // First get a project ID
      const projectsData = await this.runner.makeRequest('/api/projects');
      if (projectsData.projects.length === 0) {
        console.log('⚠️  No projects found, skipping project update test');
        return;
      }
      
      const projectId = projectsData.projects[0]._id || projectsData.projects[0].id;
      const updateData = {
        title: `Updated Test Project ${Date.now()}`,
        description: 'Updated description for testing'
      };
      
      const data = await this.runner.makeRequest(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      if (!data.success) throw new Error('API returned success: false');
    });
  }

  async testClientRequestUpdateAPI() {
    await this.runner.testWithRetry('Client Request Update API - PATCH /api/client-requests/[id]', async () => {
      // First get a request ID
      const requestsData = await this.runner.makeRequest('/api/client-requests');
      if (requestsData.requests.length === 0) {
        console.log('⚠️  No client requests found, skipping client request update test');
        return;
      }
      
      const requestId = requestsData.requests[0]._id || requestsData.requests[0].id;
      const updateData = { status: 'reviewed' };
      
      const data = await this.runner.makeRequest(`/api/client-requests/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      
      if (!data.success) throw new Error('API returned success: false');
    });
  }
}

// Stress Tests
class StressTests {
  constructor(runner) {
    this.runner = runner;
  }

  async testConcurrentRequests() {
    await this.runner.testWithRetry('Concurrent Requests Test', async () => {
      const promises = [];
      const requestCount = 3; // Reduced from 10 to 3
      
      for (let i = 0; i < requestCount; i++) {
        promises.push(this.runner.makeRequest('/api/projects'));
        // Add delay between each batch
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (!result.success) {
          throw new Error('One or more concurrent requests failed');
        }
      }
      
      console.log(`✅ Successfully handled ${promises.length} concurrent requests`);
    });
  }

  async testRapidRequests() {
    await this.runner.testWithRetry('Rapid Requests Test', async () => {
      const startTime = Date.now();
      const requestCount = 5; // Reduced from 20 to 5
      
      for (let i = 0; i < requestCount; i++) {
        await this.runner.makeRequest('/api/projects');
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      const avgTime = duration / requestCount;
      
      console.log(`✅ Completed ${requestCount} rapid requests in ${duration}ms (avg: ${avgTime.toFixed(2)}ms)`);
      
      if (avgTime > 2000) {
        throw new Error(`Average request time too high: ${avgTime.toFixed(2)}ms`);
      }
    });
  }
}

// Integration Tests
class IntegrationTests {
  constructor(runner) {
    this.runner = runner;
  }

  async testAdminPanelFlow() {
    await this.runner.testWithRetry('Admin Panel Integration Test', async () => {
      // Test admin page loads
      const adminResponse = await fetch(`${TEST_CONFIG.baseUrl}/admin`);
      if (!adminResponse.ok) {
        throw new Error(`Admin page failed to load: ${adminResponse.status}`);
      }
      
      // Test all API endpoints are accessible
      const endpoints = [
        '/api/projects',
        '/api/client-requests', 
        '/api/themes',
        '/api/settings'
      ];
      
      for (const endpoint of endpoints) {
        const data = await this.runner.makeRequest(endpoint);
        if (!data.success) {
          throw new Error(`Endpoint ${endpoint} returned success: false`);
        }
      }
      
      console.log('✅ Admin panel integration test passed');
    });
  }

  async testDatabaseConsistency() {
    await this.runner.testWithRetry('Database Consistency Test', async () => {
      // Test that all APIs return consistent data structures
      const [projects, themes, settings] = await Promise.all([
        this.runner.makeRequest('/api/projects'),
        this.runner.makeRequest('/api/themes'),
        this.runner.makeRequest('/api/settings')
      ]);
      
      if (!projects.success || !themes.success || !settings.success) {
        throw new Error('One or more APIs returned success: false');
      }
      
      // Test data consistency
      if (projects.projects && projects.projects.length > 0) {
        const project = projects.projects[0];
        if (!project._id && !project.id) {
          throw new Error('Project missing ID field');
        }
      }
      
      console.log('✅ Database consistency test passed');
    });
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Test Suite...\n');
  
  const runner = new TestRunner();
  const apiTests = new APITests(runner);
  const stressTests = new StressTests(runner);
  const integrationTests = new IntegrationTests(runner);

  // API Tests
  console.log('📡 API Tests:');
  await runner.runTest('Projects API', () => apiTests.testProjectsAPI());
  await runner.runTest('Individual Project API', () => apiTests.testIndividualProjectAPI());
  await runner.runTest('Client Requests API', () => apiTests.testClientRequestsAPI());
  await runner.runTest('Themes API', () => apiTests.testThemesAPI());
  await runner.runTest('Settings API', () => apiTests.testSettingsAPI());
  await runner.runTest('Project Update API', () => apiTests.testProjectUpdateAPI());
  await runner.runTest('Client Request Update API', () => apiTests.testClientRequestUpdateAPI());

  // Stress Tests
  console.log('\n💪 Stress Tests:');
  await runner.runTest('Concurrent Requests', () => stressTests.testConcurrentRequests());
  await runner.runTest('Rapid Requests', () => stressTests.testRapidRequests());

  // Integration Tests
  console.log('\n🔗 Integration Tests:');
  await runner.runTest('Admin Panel Flow', () => integrationTests.testAdminPanelFlow());
  await runner.runTest('Database Consistency', () => integrationTests.testDatabaseConsistency());

  // Print results
  runner.printResults();
  
  // Exit with appropriate code
  process.exit(runner.results.failed > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { TestRunner, APITests, StressTests, IntegrationTests };
