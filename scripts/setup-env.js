// Script to help manage environment variables
const fs = require('fs');
const path = require('path');

function setupEnv() {
  const envPath = path.join(process.cwd(), '.env');
  const envProdPath = path.join(process.cwd(), '.env.production');

  // Check if .env file exists (it won't in CI/CD environments)
  if (!fs.existsSync(envPath)) {
    console.log('ℹ️ No .env file found - using environment variables from CI/CD');
    console.log('✅ Environment setup complete (CI/CD mode)');
    return;
  }

  // Read existing .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Create production env with placeholder comments
  const prodEnvContent = envContent
    .split('\n')
    .map(line => {
      if (line.trim() === '' || line.startsWith('#')) return line;
      const [key] = line.split('=');
      return `${key}=${process.env[key.trim()] || ''}`;
    })
    .join('\n');

  // Write production env file
  fs.writeFileSync(envProdPath, prodEnvContent);
  
  console.log('✅ Environment files setup complete');
  console.log('🔑 Make sure to set the following environment variables in your Netlify dashboard:');
  
  // Extract and display required env vars
  const envVars = envContent
    .split('\n')
    .filter(line => !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=')[0].trim());

  console.log('\nRequired environment variables:');
  envVars.forEach(v => console.log(`- ${v}`));
}

setupEnv();