// e2e/section10.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';

describe('test http://localhost:3001/section10', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section10')
    });

    it("click button with hx-swap=innerHTML", async () => {
        const button = page.locator('css=button[hx-target="#inner-target"][hx-swap="innerHTML"]');
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await page.waitForTimeout(500)
        const p = page.locator('css=p#inner-target')
        expect(await p.innerHTML()).toMatch(/[0-9]/)
        const p2 = page.locator('css=p#inner-target > p')
        expect(await p2.innerHTML()).toMatch(/[0-9]/)
    })

    it("click button with hx-swap=outerHTML", async () => {
        const button = page.locator('css=button[hx-target="#outer-target"][hx-swap="outerHTML"]');
        expect(await button.isVisible()).toBeTruthy()
        // before the button.click(), the p#outer-target is present
        const p = page.locator('css=p#outer-target')
        expect(await p.innerHTML()).toMatch(/hoge/)
        //
        await button.click()
        await page.waitForTimeout(500)
        // after the button.click(), the p#outer-target is no longer there)
        const p1 = page.locator('css=p#outer-target')
        expect(await p1.count()).toEqual(0)
    })

    it("click button with hx-swap=textContent", async () => {
        const button = page.locator('css=button[hx-target="#text-target"][hx-swap="textContent"]');
        // before click, the content of p#text-target contains "hoge"
        const content = await page.locator('css=p#text-target').innerText()
        expect(content).toMatch(/hoge/)
        //
        await button.click()
        await page.waitForTimeout(500)
        // after click, the content of p#text-taregt contains "&lt;p style='color:#ff0000;'&gt;2&lt;/p&gt;"
        const content2 = await page.locator('css=p#text-target').innerText();
        // content2 will be like <p style='color:#ff0000;'>2</p>
        expect(content2).toMatch(/<p/)
        expect(content2).toMatch(/style='color:#ff0000;'/)
        expect(content2).toMatch(/>[0-9]+<\/p>/)
    })

    it("click button with hx-swap=beforeend", async () => {
        const button = page.locator('css=button[hx-target="#afterbegin-target"][hx-swap="afterbegin"]')
        await button.click()
        await page.waitForTimeout(500)
        // after click, a digit will be inserted before the first child of the target element
        const p = page.locator('css=p#afterbegin-target')
        const content = await p.innerText()
        expect(content).toMatch(/[0-9]+\s+hoge/)
    })

    it("click button with hx-swap=beforebegin", async () => {
        const button = page.locator('css=button[hx-target="#beforebegin-target"][hx-swap="beforebegin"]')
        await button.click()
        await page.waitForTimeout(500)
        // after click, a digit will be inserted before the target element
        const p = page.locator('xpath=//p[@id="beforebegin-target"]/preceding-sibling::p[1]')
        expect(await p.innerText()).toMatch(/[0-9]+/)
    })

    it("click button with hx-swap=beforeend", async () => {
        const button = page.locator('css=button[hx-target="#beforeend-target"][hx-swap="beforeend"]')
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await page.waitForTimeout(500)
        // after click, a digit will be inserted after the last child of the target element
        const p = page.locator('css=p#beforeend-target')
        expect(await p.innerText()).toMatch(/hoge\s+[0-9]+/)
    })

    it("click button with hx-swap=afterend", async () => {
        const button = page.locator('css=button[hx-target="#afterend-target"][hx-swap="afterend"]')
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await page.waitForTimeout(500)
        // after click, a digit will be inserted after the target element
        const parentDiv = page.locator('xpath=//p[@id="afterend-target"]//parent::div')
        const content = await parentDiv.innerText()
        expect(content).toMatch(/foo\s+hoge\s+[0-9]+/)
    })

    it("click the button with hx-swap=delete", async () => {
        const button = page.locator('css=button[hx-swap="delete"]')
        expect(await button.isVisible()).toBeTruthy()
        await button.click()
        await page.waitForTimeout(500)
        // click the button, then the target p will be deleted
        const parentDiv = button.locator('xpath=/preceding-sibling::div[1]')
        const content = await parentDiv.innerText()
        expect(content).not.toMatch(/hoge/)
    })

    it("click the button with hx-swap=none", async () => {
        const button = page.locator('css=button[hx-swap="none"]')
        const div = page.locator('xpath=//p[@id="none-target"]/parent::div')
        const content1 = await div.innerText()
        await button.click()
        await page.waitForTimeout(500)
        const content2 = await div.innerText()
        expect(content2).toEqual(content1)
    })

    it("transition", async () => {
        const button = page.locator('xpath=//h2[contains(.,"transition")]/following-sibling::div[1]/button[contains(@hx-swap,"transition:true")]')
        const p = button.locator('xpath=./parent::div/child::p')
        expect(await p.innerText()).toMatch(/Embrace challenges/)
        //
        await button.click()
        await page.waitForTimeout(3500)
        //
        const button2 = button.locator('xpath =//h2[contains(.,"transition")]/following-sibling::div[1]/button[contains(@hx-swap,"transition:true")]')
        const p2 = button.locator('xpath=./parent::div/child::p')
        expect(await p.innerText()).toMatch(/挑戦を受け入れよう/)
    })

    it("swap:3s", async () => {
        const content = await page.locator('p#swap-target').innerText()
        expect(content).toMatch(/foo/)
        const button = page.locator('p#swap-target').locator('xpath=following-sibling::button[1]')
        await button.click()
        await page.waitForTimeout(3500)
        const content2 = await page.locator('p#swap-target').innerText()
        expect(content2).toMatch(/[0-9]+/)
        expect(content2).not.toEqual(content)
    })

    it("settle", async () => {
        const div = page.locator('xpath=//h2[contains(.,"settle")]/following-sibling::div[1]')
        const content = await div.locator('css=p').innerText()
        expect(content).toMatch(/Embrace challenges/)
        const button = div.locator('css=button')
        await button.click()
        await page.waitForTimeout(3500)
        const content2 = await div.locator('css=p').innerText()
        expect(content2).toMatch(/挑戦を受け入れよう/)
    })

    it("ignoreTitle:false", async () => {
        const button = page.locator('xpath=//h3[contains(.,"ignoreTitleがfalseの時")]/following-sibling::button[1]')
        await button.click()
        await page.waitForTimeout(500)
        expect(await page.title()).toMatch(/New Title/)
    })

    it("ignoreTitle:true", async () => {
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section10')
        //
        const button = page.locator('xpath=//h3[contains(.,"ignoreTitleがtrueの時")]/following-sibling::button[1]')
        await button.click()
        await page.waitForTimeout(500)
        expect(await page.title()).not.toMatch(/New Title/)
    })

    it("scroll", async () => {
        // what use? I don't see
    })

    it("show", async () => {
        // difficult to test
    })

    afterAll(async () => {
        await browser.close();
    });
});
