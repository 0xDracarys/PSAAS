const bcrypt = require('bcryptjs');

const password = 'Admin@123';

async function generateAndVerify() {
  console.log('Generating hash for password:', password);
  
  const hash = await bcrypt.hash(password, 10);
  console.log('\nGenerated hash:');
  console.log(hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('\nVerification result:', isValid);
  
  // Double verify
  const doubleCheck = await bcrypt.compare(password, hash);
  console.log('Double verification:', doubleCheck);
  
  console.log('\n===== USE THIS HASH =====');
  console.log(hash);
  console.log('=========================');
  console.log('\nPassword:', password);
}

generateAndVerify().catch(console.error);
