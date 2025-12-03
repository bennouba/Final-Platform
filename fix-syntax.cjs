const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix the syntax error - remove extra comma
const newContent = content.replace('    products: [],\r\n,\r\n\r\n  indeesh:', '    products: [],\r\n\r\n\r\n  indeesh:');

fs.writeFileSync(path, newContent);
console.log('✅ Syntax fixed!');