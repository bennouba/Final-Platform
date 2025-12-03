const fs = require('fs');
const path = 'src/config/storeConfig.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the index of }};
const idx = content.lastIndexOf('};');
console.log('Last }; at index:', idx);
console.log('Context:', content.substring(idx - 50, idx + 10));

// Look for "magna-beauty"
const magnaIdx = content.indexOf('magna-beauty');
console.log('\nmagna-beauty at index:', magnaIdx);

// Try the real replacement
const searchStr = '  },\n};';
if (content.includes(searchStr)) {
  console.log('\n✓ Found search pattern');
} else {
  console.log('\n✗ Search pattern not found');
  console.log('Looking for closing brace...');
  const tail = content.substring(content.length - 100);
  console.log('Last 100 chars:', JSON.stringify(tail));
}