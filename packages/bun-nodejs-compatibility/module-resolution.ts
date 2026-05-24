// module-resolution.js
// Handling module resolution edge cases

// Bun prefers ESM but supports CommonJS
// If you encounter issues, check your package.json type field

// CommonJS style (works in both)
//const fs = require('fs');

// ESM style (works in both with proper configuration)
import fs from 'fs';

// Dynamic imports work in both
async function loadModule() {
    const module = await import('./dynamic-module.js');
    return module.default;
}

// __dirname and __filename work in Bun
console.log('Directory:', __dirname);
console.log('Filename:', __filename);

// import.meta.url also works
console.log('URL:', import.meta.url);
