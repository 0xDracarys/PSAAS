const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/projects',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('✅ Server is working correctly');
      } catch (e) {
        console.log('❌ Server returned HTML instead of JSON');
      }
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
});

req.end();




