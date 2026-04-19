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

    it("keyup without changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target1"]');
        expect(await input.isVisible());
        await input.fill('abc');
        const content1 = await page.locator('css=p#changed-target1').innerText();
        expect(content1.match(/abc/))
    })

    it("keyup with changed", async () => {
        const input = page.locator('css=input[hx-target="#changed-target2"]');
        expect(await input.isVisible())
        await input.fill('abc')
        const content1 = await page.locator('css=p#changed-target2').innerText();
        expect(content1.match(/abc/));
        await input.fill('abc')
        const content2 = await page.locator('css=p#changed-target2').innerText();
        expect(content2.match(/abc/));
    })

    it("keyup without delay", async () => {
        const input = page.locator('css=input[hx-target="#delay-target1"]');
        expect(await input.isVisible())
        await input.fill('abc')
        const content1 = await page.locator('css=p#delay-target1').innerText()
        expect(content1.match(/abc/))
    })

    it("keyup with delay of 3s", async () => {
        const input = page.locator('css=input[hx-target="#delay-target2"]');
        expect(await input.isVisible())
        await input.fill('abc')
        const content1 = await page.locator('css=p#delay-target2').innerText()
        expect(content1.match(/abc/))
        //
        await input.fill('123')
        const content2 = await page.locator('css=p#delay-target2').innerText()
        expect(content2.match(/abc/))
        //
        await page.waitForTimeout(4000);
        //
        const content3 = await page.locator('css=p#delay-target2').innerText()
        expect(content3.match(/123/))
    })

    it("keyup change throttle:3s", async () => {
        const input = page.locator('css=input[hx-target="#throttle-target2"]');
        expect(await input.isVisible())
        await input.fill("abc")
        const content1 = await page.locator('css=p#throttle-target2').innerText()
        expect(content1.match(/123/))
        //
        await input.fill("123")
        const content2 = await page.locator('css=p#throttle-target2').innerText()
        expect(content2.match(/abc/))   // not "123"
        //
        await page.waitForTimeout(4000);
        //
        await input.fill("XYZ");
        const content3 = await page.locator('css=p#throttle-target2').innerText();
        expect(content3.match(/XYZ/));
    })

    it("from:CSS selector", async () => {
        const input4 = page.locator('css=input#input4');
        expect(await input4.isVisible())
        await input4.fill("abc")
        const content = page.locator('css=#from-target').innerText()
        expect((await content).match(/[0-9]+/))
    })


    afterAll(async () => {
        await browser.close();
    });
});
