// fs-example.js
// Demonstrates file system operations that work identically in Node.js and Bun
// quoted from https://oneuptime.com/blog/post/2026-01-31-bun-nodejs-compatibility/view
import fs from 'fs';
import path from 'path';

// Reading files synchronously
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
console.log('Config loaded:', config);

// Writing files
const outputData = { timestamp: Date.now(), status: 'processed' };
fs.writeFileSync(
    path.join(__dirname + '/out', 'output.json'),
    JSON.stringify(outputData, null, 2)
);

// Async file operations using promises
import fsPromises from 'fs/promises';

async function processFiles() {
    // Read directory contents
    const files = await fsPromises.readdir(__dirname);
    console.log('Files in directory:', files);

    // Check if file exists
    try {
        await fsPromises.access(configPath);
        console.log('Config file exists and is accessible');
    } catch {
        console.log('Config file not found or is not accessible');
    }
}

processFiles();

