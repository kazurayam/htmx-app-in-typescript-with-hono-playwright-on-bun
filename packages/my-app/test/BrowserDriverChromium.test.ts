// test/BrowserDriverChromium.test.ts
import { describe, test, expect } from 'bun:test';
import { BrowserDriverChromium } from './BrowserDriverChromium';

describe('test the BrowserDriverChromium class', () => {
    test('test create', async () => {
        const driver = await BrowserDriverChromium.create();
        expect(driver.getBrowser().browserType().name()).toBe('chromium');
        expect(driver.getContext().browser()?.browserType().name()).toBe('chromium');
    })
    test('test navigateToUrl', async () => {
        const driver = await BrowserDriverChromium.create();
        const page = await driver.navigateToUrl('https://www.google.com/')
        expect(page).not.toBeNull();
        expect(page.url()).toBe('https://www.google.com/')
    })
})
