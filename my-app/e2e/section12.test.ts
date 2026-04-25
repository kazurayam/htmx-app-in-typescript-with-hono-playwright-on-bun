// e2e/section12.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section12', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section12')
    });

    it("hx-params=*", async () => {
        const form = page.locator('css=form[hx-params="*"]')
        // send texts in the input fields
        await form.locator('css=input[name="title"]').fill('greeting')
        await form.locator('css=input[name="name"]').fill('kazurayam')
        await form.locator('css=input[name="age"]').fill('66')
        // click the button
        const button = page.locator('css=form[hx-params="*"] button')
        await button.click()
        await page.waitForTimeout(1500)
        // assert the target to contain "title=aaa&name=bbb&age=66"
        const text = await page.locator('css=p#all-target').innerText()
        expect(text).toMatch(/title=greeting&name=kazurayam&age=66/)
    })

    afterAll(async () => {
        await browser.close();
    });
});
