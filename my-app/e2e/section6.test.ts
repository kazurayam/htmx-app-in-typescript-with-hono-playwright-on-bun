// e2e/section6.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section6', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section6', { timeout: 10000 })
    });

    it("hx-trigger=click without once", async () => {
        const button = page.locator('css=button[hx-target="#once-target1"]');
        expect(await button.isVisible()).toBeTruthy();
        const content0 = await page.locator('css=p#once-target1').innerText();
        expect(content0).toMatch(/onceなし/);
        await button.click();
        await page.waitForTimeout(500)
        const content1 = await page.locator('css=p#once-target1').innerText();
        expect(content1).toMatch(/[0-9]/);
        // click the button once again
        await button.click();
        await page.waitForTimeout(500)
        const content2 = await page.locator('css=p#once-target1').innerText();
        expect(content1).toMatch(/[0-9]/);
        // the text would change
        expect(content1).not.toEqual(content2);
    })

    it("hx-trigger=click with once", async () => {
        const button = page.locator('css=button[hx-target="#once-target2"]');
        expect(await button.isVisible()).toBeTruthy();
        await button.click();
        await page.waitForTimeout(500)
        const content1 = await page.locator('css=p#once-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        // click the button once again
        await button.click();
        await page.waitForTimeout(500)
        const content2 = await page.locator('css=p#once-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        // the text would stay the same
        expect(content1).toEqual(content2);
    })

    it("hx-trigger=keyup without changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target1"]');
        expect(await input.isVisible()).toBeTruthy();
        await input.press('Enter');
        await page.waitForTimeout(500);
        const content1 = await page.locator('css=p#changed-target1').innerText();
        expect(content1).toMatch(/[0-9]+/);
    })

    it("hx-trigger=keyup with changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target2"]');
        expect(await input.isVisible()).toBeTruthy();
        await input.fill('a')
        await input.press('Enter')
        await page.waitForTimeout(500)
        const content1 = await page.locator('css=p#changed-target2').innerText();
        expect(content1).toMatch(/[0-9]/);
        await input.press('Enter')
        const content2 = await page.locator('css=p#changed-target2').innerText();
        expect(content2).toEqual(content1);
    })

    it("hx-trigger=keyup without delay", async () => {
        const input = page.locator('css=input[hx-target="#delay-target1"]');
        expect(await input.isVisible()).toBeTruthy()
        await input.fill('a')
        await input.press('Enter')
        await page.waitForTimeout(500)
        const content1 = await page.locator('css=p#delay-target1').innerText()
        expect(content1).toMatch(/[0-9]+/);
    })

    it("hx-trigger=keyup with delay of 3s", async () => {
        const input = page.locator('css=input[hx-target="#delay-target2"]');
        expect(await input.isVisible()).toBeTruthy();
        await input.fill('a')
        await input.press('Enter')
        const content1 = await page.locator('css=p#delay-target2').innerText()
        expect(content1).toMatch(/delay 3秒/);
        //
        await page.waitForTimeout(3500)
        //
        const content2 = await page.locator('css=p#delay-target2').innerText()
        expect(content2).toMatch(/[0-9]+/);
    })

    it("hx-trigger=keyup change throttle:3s", async () => {
        const input = page.locator('css=input[hx-target="#throttle-target2"]');
        expect(await input.isVisible()).toBeTruthy()
        await input.fill("a")
        await input.press('Enter')
        await page.waitForTimeout(500)
        const content1 = await page.locator('css=p#throttle-target2').innerText()
        expect(content1).toMatch(/[0-9]+/);
        //
        await input.fill("1")
        await input.press('Enter')
        const content2 = await page.locator('css=p#throttle-target2').innerText()
        expect(content2).toEqual(content1);
        //
        await page.waitForTimeout(3500);
        //
        await input.fill("X");
        await input.press('Enter')
        await page.waitForTimeout(500)
        const content3 = await page.locator('css=p#throttle-target2').innerText();
        expect(content3).not.toEqual(content2);
    })

    it("hx-trigger=from:CSS selector", async () => {
        const input4 = page.locator('css=input#input4');
        expect(await input4.isVisible()).toBeTruthy()
        await input4.fill("abc")
        await input4.press('Enter')
        await page.waitForTimeout(500)
        const content = await page.locator('css=#from-target').innerText()
        expect(content).toMatch(/[0-9]+/);
    })

    it("hx-trigger=target:CSS selector", async () => {
        const button3 = page.locator('css=div[hx-trigger="click target:.btn"] div button')
        expect(await button3.isVisible()).toBeTruthy()
        await button3.click()
        await page.waitForTimeout(500)
        const p = page.locator('css=p#target-target')
        expect(await p.innerText()).toMatch(/[0-9]+/);
    })

    it("hx-trigger=consume", async () => {
        const button = page.locator('css=button[hx-trigger="click consume"]')
        expect(await button.isVisible()).toBeTruthy();
        await button.click()
        const p = page.locator('css=p#consume-target2');
        expect(await p.innerText()).toMatch(/consumeあり/);
    })

    it("hx-trigger=queue", async () => {
        const button = page.locator('css=button[hx-trigger="click queue:all"]')
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await button.click()
        await page.waitForTimeout(500)
        const result = await page.locator('css=div#result1').locator('css=div').count()
        expect(result).toEqual(2);
    })

    afterAll(async () => {
        await browser.close();
    });
});
