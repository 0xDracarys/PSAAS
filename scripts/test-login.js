const http = require('http');

const postData = JSON.stringify({
  username: 'shubhambhasker@gmail.com',
  password: 'Admin@123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔐 Testing login...');
console.log('Username:', 'shubhambhasker@gmail.com');
console.log('Password:', 'Admin@123');
console.log('');

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  console.log('');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📦 Response Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (json.success) {
        console.log('\n✅ SUCCESS! Login worked!');
      } else {
        console.log('\n❌ FAILED! Error:', json.error);
      }
    } catch (e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
