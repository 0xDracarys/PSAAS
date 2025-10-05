const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djxdsicuv',
  api_key: '614924959886856',
  api_secret: 'INt3jWuq9p35dWjhC9uI4mtkXgU'
});

console.log('🔄 Testing Cloudinary upload...');

// Test with a tiny 1x1 pixel PNG image (base64)
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

cloudinary.uploader.upload(testImage, {
  folder: 'test',
  resource_type: 'auto',
  public_id: `test-${Date.now()}`
})
.then(result => {
  console.log('✅ Upload successful!');
  console.log('URL:', result.secure_url);
  console.log('Public ID:', result.public_id);
  console.log('Format:', result.format);
})
.catch(error => {
  console.error('❌ Upload failed!');
  console.error('Error message:', error.message);
  console.error('HTTP code:', error.http_code);
  console.error('Full error:', JSON.stringify(error, null, 2));
  process.exit(1);
});
