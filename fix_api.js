const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'services', 'api.ts');
const enhancedApiPath = path.join(__dirname, 'src', 'services', 'enhancedApi.ts');

// Fix api.ts
let content = fs.readFileSync(apiPath, 'utf8');
content = content.replace(/http:\/\/localhost:4000/g, 'http://localhost:5000');
fs.writeFileSync(apiPath, content);
console.log('✅ Updated api.ts');

// Fix enhancedApi.ts
let enhancedContent = fs.readFileSync(enhancedApiPath, 'utf8');
enhancedContent = enhancedContent.replace(/http:\/\/localhost:4000/g, 'http://localhost:5000');
fs.writeFileSync(enhancedApiPath, enhancedContent);
console.log('✅ Updated enhancedApi.ts');
