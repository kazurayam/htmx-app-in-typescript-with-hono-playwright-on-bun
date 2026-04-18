// e2e/section6.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section6', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section6')
    });

    it("click without once", async () => {
        const button = page.locator('css=button[hx-target="#once-target1"]');
        expect(await button.isVisible());
        await button.click();
        const content1 = await page.locator('css=p#once-target1').innerText();
        expect(content1.match(/[0-9]/));
        // click the button once again
        await button.click();
        const content2 = await page.locator('css=p#once-target1').innerText();
        expect(content1.match(/[0-9]/));
        // the text would change
        expect(content1 != content2);
    })

    it("click with once", async () => {
        const button = page.locator('css=button[hx-target="#once-target2"]');
        expect(await button.isVisible());
        await button.click();
        const content1 = await page.locator('css=p#once-target2').innerText();
        expect(content1.match(/[0-9]/));
        // click the button once again
        await button.click();
        const content2 = await page.locator('css=p#once-target2').innerText();
        expect(content1.match(/[0-9]/));
        // the text would stay the same
        expect(content1 == content2);
    })

    it("keyup witout changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target1"]');
        expect(await input.isVisible());
        await input.fill('abc');
        const content1 = await page.locator('css=p#changed-target1').innerText();
        expect(content1.match(/abc/))
    })

    afterAll(async () => {
        await browser.close();
    });
});
