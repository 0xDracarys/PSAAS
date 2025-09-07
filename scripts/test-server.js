#!/usr/bin/env node

const http = require('http');

async function testServer(port = 3001) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/projects',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            port: port
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            port: port,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        port: port,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        port: port,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function findServer() {
  const ports = [3000, 3001, 3002, 3003];
  
  for (const port of ports) {
    try {
      console.log(`🔍 Testing port ${port}...`);
      const result = await testServer(port);
      console.log(`✅ Server found on port ${port} - Status: ${result.status}`);
      return result;
    } catch (error) {
      console.log(`❌ Port ${port} - ${error.error}`);
    }
  }
  
  throw new Error('No server found on any port');
}

// Run the test
findServer()
  .then(result => {
    console.log('\n📊 Server Test Results:');
    console.log(`Port: ${result.port}`);
    console.log(`Status: ${result.status}`);
    console.log(`Data keys:`, Object.keys(result.data || {}));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Server Test Failed:', error.message);
    process.exit(1);
  });




