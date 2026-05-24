// app.test.js
// Example test file using Bun's test runner

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';

// Import the module to test
const { add, multiply, fetchData } = require('./math');

describe('Math operations', () => {
    test('add should sum two numbers', () => {
        expect(add(2, 3)).toBe(5);
        expect(add(-1, 1)).toBe(0);
        expect(add(0, 0)).toBe(0);
    });

    test('multiply should multiply two numbers', () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-2, 3)).toBe(-6);
    });
});

describe('Async operations', () => {
    test('fetchData should return data', async () => {
        const data = await fetchData();
        expect(data).toBeDefined();
        expect(data.status).toBe('success');
    });
});

// Run tests with: bun test
