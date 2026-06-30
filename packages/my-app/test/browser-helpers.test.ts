// test/browser-helpers.test.ts
import { describe, test, expect } from 'bun:test';
import { getLogger } from '@logtape/logtape';
import * as PW from '@playwright/test';
import * as BH from './browser-helpers';

const logger = getLogger(["my-app", "browser-helpers.test"]);

describe('test browser-helpers', () => {
    test('test launchChromium function', async () => {
        const browser = await BH.launchChromium();
        expect(browser.browserType().name()).toBe('chromium');
        browser.close();
    })
    test('open chromium with headless=false', async () => {
        const browser = await BH.launchChromium({ headless: false });
        expect(browser.browserType().name()).toBe('chromium');
        await delay(3000);
        browser.close();
    })
    test('test openChromium function', async () => {
        const { browser, context } = await BH.openChromium();
        expect(browser.browserType().name()).toBe('chromium');
        expect(context.browser()?.browserType().name()).toBe('chromium');
        browser.close();
    })
})

async function delay(timeoutMs: number) {
    await new Promise(resolve => setTimeout(resolve, timeoutMs));
}
