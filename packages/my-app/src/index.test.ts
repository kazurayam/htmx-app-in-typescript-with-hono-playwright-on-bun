// src/index.e2e.ts
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { testClient } from 'hono/testing';   // https://www.honojs.com/docs/helpers/testing
import { getLogger } from '@logtape/logtape';
import { app } from './index';

const logger = getLogger(["my-app", "index.test"]);

describe('getting started', () => {
    test('GET /', async () => {
        const res = await app.request('/', { method: 'GET' });
        expect(res.status).toBe(200);
    })
})

describe('verify response as HTML Text', async () => {
    test('should return HTML content with "Hello htmx"', async () => {
        const client = testClient(app);
        const res = await client.index.$get();
        expect(res.status).toBe(200);
        const text: string = await res.text();
        expect(text).toContain('Hello htmx!');
    })
})

/**
 * See ["Write browser DOM tests with Bun and happy-dom"](https://bun.com/docs/guides/test/happy-dom)
 * for performing unit-testing over a .tsx file that does Server-Side-Rendered JSX written in TypeScript on Bun.
 * Happy DOM is a JavaScript implementation of a web browser without its graphical user interface.
 */
describe('verify response as HTML DOM', async () => {
    test('should return HTML content with "Hello htmx"', async () => {
        const client = testClient(app);
        const res = await client.index.$get({});
        expect(res.status).toBe(200);
        const text: string = await res.text();
        const dom = new DOMParser().parseFromString(text, 'text/html');
        const p = dom.querySelector('p');
        expect(p?.textContent).toBe('Hello htmx!');
    })
    test('click the button, then the content of the <div id="result">...</div> should be updated', async () => {
        const client = testClient(app)
        const res = await client.index.$get({});
        expect(res.status).toBe(200);
        const text: string = await res.text();
        const dom = new DOMParser().parseFromString(text, 'text/html');
        // find the button and click it
        const button = dom.querySelector('button');
        expect(button).not.toBeNull();
        button?.addEventListener('click', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for the click event to be processed
            // after clicking the button, the content of the div with id "result" should be updated by htmx
            const resultDiv = dom.querySelector('#result');
            logger.debug(resultDiv?.textContent);
            expect(resultDiv?.textContent).toBe('こんにちは!');
        });
        button?.click();
    })
})
