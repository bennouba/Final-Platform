const crypto = require('crypto');

const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('Generated Encryption Key:');
console.log(encryptionKey);
console.log('\nAdd this to your .env file:');
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
