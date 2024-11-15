// test-bcrypt.js

const bcrypt = require('bcrypt');

(async () => {
  const plainPassword = 'adminpassword';

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed Password:', hashedPassword);

  // Compare the password
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password Match:', match);
})();
