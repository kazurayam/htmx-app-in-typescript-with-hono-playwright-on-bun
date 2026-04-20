// e2e/section8.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section8', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section8', { timeout: 10000 })
    });

    it("hx-trigger=every 1s", async () => {
        const p_as_target = page.locator('css=p#every-target');
        const content1 = await p_as_target.innerText();
        await page.waitForTimeout(1500)
        const content2 = await p_as_target.innerText();
        expect(content1).toMatch(/foo/);
        expect(content2).toMatch(/[0-9]+/);
        expect(content1).not.toEqual(content2)
    })

    it("hx-trigger=load delay:3s", async () => {
        const p1 = page.locator('css=p[hx-trigger="load delay:3s"]')
        expect((await p1.innerText()).match(/hoge/))
        await page.waitForTimeout(3000);
        const p2 = page.locator('css=p[hx-trigger="load delay:3s"]')
        expect(await p2.innerText()).toMatch(/[0-9]+/);
    })

    it("hx-trigger=load, click delay: 0.5s", async () => {
        const p = page.locator('css=p#multiple-trigger-target')
        const content1 = await p.innerText()
        expect(content1).toMatch(/[0-9]+/);
        const button = page.locator('css=button[hx-target="#multiple-trigger-target"]')
        await button.click();
        await page.waitForTimeout(1000)
        const content2 = await p.innerText()
        expect(content2).toMatch(/[0-9]+/);
        expect(content1).not.toEqual(content2)
    })

    afterAll(async () => {
        await browser.close();
    });
});
