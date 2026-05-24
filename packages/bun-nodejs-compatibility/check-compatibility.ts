// check-compatibility.js
// This script tests the availability of common Node.js modules in Bun
// quote from https://oneuptime.com/blog/post/2026-01-31-bun-nodejs-compatibility/view

const modules = [
    'fs',
    'path',
    'http',
    'https',
    'crypto',
    'buffer',
    'stream',
    'events',
    'util',
    'os',
    'child_process',
    'url',
    'querystring',
    'zlib'
];

console.log('Checking Node.js module compatibility in Bun:\n');

modules.forEach(mod => {
    try {
        require(mod);
        console.log(`✓ ${mod} - Available`);
    } catch (error) {
        console.log(`✗ ${mod} - Not available or partial support`);
    }
});

/**
$ bun src/check-compatibility.ts
Checking Node.js module compatibility in Bun:

✓ fs - Available
✓ path - Available
✓ http - Available
✓ https - Available
✓ crypto - Available
✓ buffer - Available
✓ stream - Available
✓ events - Available
✓ util - Available
✓ os - Available
✓ child_process - Available
✓ url - Available
✓ querystring - Available
✓ zlib - Available
 */
