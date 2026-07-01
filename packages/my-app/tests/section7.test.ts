// tests/section7.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section7.test"]);
const url = 'http://localhost:3001/section7';

describe(`test ${url}`, async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let driver: BrowserDriverChromium;
    let page: PW.Page;
    beforeAll(async () => {
        driver = await BrowserDriverChromium.create('section7');
    });
    beforeEach(async () => {
        page = await driver.navigateToUrl(url);
    }, 20_000);

    test("hx-trigger=load delay:3s", async () => {
        const p = page.locator('css=p[hx-trigger="load delay:3s"]');
        await PW.expect(p).toContainText(/foo/);
        await page.waitForTimeout(3500);
        await PW.expect(p).toContainText(/[0-9]+/);
    })

    test("hx-trigger=revealed delay:1s", async () => {
        const p_as_target = page.locator('css=p#target1');
        await PW.expect(p_as_target).toContainText(/foo/);
        const p_as_trigger = page.locator('css=p[hx-trigger="revealed delay:1s"]');
        // scroll to the element
        await p_as_trigger.scrollIntoViewIfNeeded();
        // will show a digit after delay:1s
        await page.waitForTimeout(1500);
        await PW.expect(p_as_target).toContainText(/[0-9]+/);
    })

    /*
     * tests for ht-trigger="interset" are omitted as are cumbersome
     */

    afterEach(async () => {
        await page.close();
    });

    afterAll(async () => {
        driver.close();
    })
});
