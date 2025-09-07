#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.testResults = [];
    this.isServerRunning = false;
    this.serverProcess = null;
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      console.log('🚀 Starting development server...');
      
      this.serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        shell: true,
        cwd: process.cwd()
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server startup timeout'));
        }
      }, 30000);

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[SERVER] ${output.trim()}`);
        
        if (output.includes('Local:')) {
          // Parse the actual port from Next.js output and expose to child tests
          const match = output.match(/Local:\s+http:\/\/localhost:(\d+)/);
          if (match) {
            const port = match[1];
            process.env.BASE_URL = `http://localhost:${port}`;
            console.log(`🌐 Using BASE_URL=${process.env.BASE_URL}`);
          }
        }

        if (output.includes('Ready in')) {
          serverReady = true;
          clearTimeout(timeout);
          this.isServerRunning = true;
          console.log('✅ Server is ready!');
          resolve();
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        console.error(`[SERVER ERROR] ${data.toString().trim()}`);
      });

      this.serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.serverProcess.on('exit', (code) => {
        if (!serverReady) {
          clearTimeout(timeout);
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }

  async runTests() {
    console.log('🧪 Running comprehensive test suite...');
    
    try {
      const testProcess = spawn('node', ['__tests__/api.test.js'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd()
      });

      return new Promise((resolve, reject) => {
        testProcess.on('exit', (code) => {
          if (code === 0) {
            console.log('✅ All tests passed!');
            resolve();
          } else {
            console.log(`❌ Tests failed with exit code ${code}`);
            reject(new Error(`Tests failed with exit code ${code}`));
          }
        });

        testProcess.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(`Failed to run tests: ${error.message}`);
    }
  }

  async stopServer() {
    if (this.serverProcess && this.isServerRunning) {
      console.log('🛑 Stopping development server...');
      this.serverProcess.kill('SIGTERM');
      
      return new Promise((resolve) => {
        this.serverProcess.on('exit', () => {
          this.isServerRunning = false;
          console.log('✅ Server stopped');
          resolve();
        });
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (this.isServerRunning) {
            this.serverProcess.kill('SIGKILL');
            this.isServerRunning = false;
            console.log('⚠️  Server force stopped');
            resolve();
          }
        }, 5000);
      });
    }
  }

  async run() {
    try {
      await this.startServer();
      
      // Wait a bit for server to be fully ready
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await this.runTests();
      
    } catch (error) {
      console.error('❌ Test runner failed:', error.message);
      process.exit(1);
    } finally {
      await this.stopServer();
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down...');
  if (this.serverProcess) {
    this.serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  if (this.serverProcess) {
    this.serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Run the test runner
const runner = new TestRunner();
runner.run().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});




