// e2e/section14.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section14', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section14')
    });

    it("継承 hx-targetの例", async () => {
        const div = page.locator('css=div[hx-target="#target1"]')
        const button1 = div.locator('css=button:nth-child(1)')
        const button2 = div.locator('css=button:nth-child(2)')
        const button3 = page.locator('xpath=//h2[contains(text(),"hx-targetの例")]/following-sibling::button[1]')
        //
        await button1.click()
        await page.waitForTimeout(500)
        expect(await page.locator('css=p#target1').innerText()).toMatch(/[0-9]+/)
        //
        await button2.click()
        await page.waitForTimeout(500)
        expect(await page.locator('css=p#target2').innerText()).toMatch(/[0-9]+/)
        //
        await button3.click()
        await page.waitForTimeout(500)
        expect(await button3.innerText()).toMatch(/[0-9]+/)
    })

    afterAll(async () => {
        await browser.close();
    });
});
