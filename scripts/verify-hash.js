const bcrypt = require('bcryptjs');

const password = 'Admin@123';
const hash = '$2b$10$Nx5ymR7r6Q9iPfB872fYj.QNE5bfUhRs.NoxjSbgJpzJyzQtmzwP.';

async function verify() {
  console.log('Testing password:', password);
  console.log('Against hash:', hash);
  
  const result = await bcrypt.compare(password, hash);
  console.log('\n✅ Result:', result);
  
  if (result) {
    console.log('\n🎉 SUCCESS! Password matches the hash!');
  } else {
    console.log('\n❌ FAILED! Password does not match!');
  }
}

verify().catch(console.error);
