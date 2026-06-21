// test/section16.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section16.test"]);
const url = 'http://localhost:3001/section16';

describe(`test ${url}`, async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
        let driver: BrowserDriverChromium;
        let page: PW.Page;
        beforeAll(async () => {
            driver = await BrowserDriverChromium.create('section4');
        });
        beforeEach(async () => {
            page = await driver.navigateToUrl(url);
        }, 20_000);

    test("validation", async () => {
        const input = page.locator('css=input[hx-on-htmx-validation-validate]');
        await input.waitFor({ state: 'visible', timeout: 5_000 });
        await input.fill('鳥');
        const button = input.locator('xpath=following-sibling::button[1]');
        await PW.expect(button).toBeEnabled();
        const responsePromise =
            page.waitForResponse(/\/send-form/, { timeout: 10000 });
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p = page.locator('css=p#target');
        await PW.expect(p).toContainText('ペンギンと入力してください')
    })

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        driver.close()
    });
})
