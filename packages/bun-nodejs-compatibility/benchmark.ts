// benchmark.js
// Simple benchmark to compare execution times

const iterations = 1000000;

// Benchmark JSON parsing
function benchmarkJSON() {
    const start = performance.now();
    const data = { name: 'test', value: 123, nested: { a: 1, b: 2 } };

    for (let i = 0; i < iterations; i++) {
        const str = JSON.stringify(data);
        JSON.parse(str);
    }

    const duration = performance.now() - start;
    console.log(`JSON operations (${iterations}x): ${duration.toFixed(2)}ms`);
}

// Benchmark array operations
function benchmarkArrays() {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
        const arr = Array.from({ length: 100 }, (_, i) => i);
        arr.map(x => x * 2).filter(x => x > 50).reduce((a, b) => a + b, 0);
    }

    const duration = performance.now() - start;
    console.log(`Array operations (${iterations}x): ${duration.toFixed(2)}ms`);
}

import crypto from 'crypto';

// Benchmark crypto operations
async function benchmarkCrypto() {
    const start = performance.now();

    for (let i = 0; i < 10000; i++) {
        crypto.createHash('sha256').update('hello world').digest('hex');
    }

    const duration = performance.now() - start;
    console.log(`Crypto hash (10000x): ${duration.toFixed(2)}ms`);
}

console.log(`Runtime: ${typeof Bun !== 'undefined' ? 'Bun' : 'Node.js'}`);
console.log('Starting benchmarks...\n');

benchmarkJSON();
benchmarkArrays();
benchmarkCrypto();
