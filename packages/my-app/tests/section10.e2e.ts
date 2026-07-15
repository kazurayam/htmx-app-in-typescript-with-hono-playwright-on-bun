// tests/section10.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section10.e2e"]);
const url = 'http://localhost:3001/section10';

describe(`test ${url}`, async () => {
    // Here I assume that the server at http://localhost:3001 is already up and running.
    let driver: BrowserDriverChromium;
    let page: PW.Page;
    beforeAll(async () => {
        driver = await BrowserDriverChromium.create('section9');
    });
    beforeEach(async () => {
        page = await driver.navigateToUrl(url);
    }, 20_000);

    test("click button with hx-swap=innerHTML", async () => {
        const button: PW.Locator = page.locator('css=button[hx-target="#inner-target"][hx-swap="innerHTML"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const p: PW.Locator = page.locator('css=p#inner-target')
        expect(await p.innerHTML()).toMatch(/[0-9]/)
        const p2 = page.locator('css=p#inner-target > p')
        await PW.expect(p2).toContainText(/[0-9]/)
        // the following statement does the same as above:
        // expect(await p2.innerHTML()).toMatch(/[0-9]/)
    })

    test("click button with hx-swap=outerHTML", async () => {
        const button = page.locator('css=button[hx-target="#outer-target"][hx-swap="outerHTML"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();

        // before the button.click(), the p#outer-target is present
        const p = page.locator('css=p#outer-target')
        await PW.expect(p).toContainText(/hoge/)
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after the button.click(), the p#outer-target is no longer there)
        const p1 = page.locator('css=p#outer-target')
        await PW.expect(p1).toHaveCount(0)
    })

    test("click button with hx-swap=textContent", async () => {
        const button = page.locator('css=button[hx-target="#text-target"][hx-swap="textContent"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();

        // before click, the content of p#text-target contains "hoge"
        await PW.expect(page.locator('css=p#text-target')).toContainText(/hoge/)
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after click, the content of p#text-taregt contains "&lt;p style='color:#ff0000;'&gt;2&lt;/p&gt;"
        const content2 = await page.locator('css=p#text-target').innerText();
        // content2 will be like <p style='color:#ff0000;'>2</p>
        expect(content2).toMatch(/<p/)
        expect(content2).toMatch(/style='color:#ff0000;'/)
        expect(content2).toMatch(/>[0-9]+<\/p>/)
    })

    test("click button with hx-swap=beforeend", async () => {
        const button = page.locator('css=button[hx-target="#afterbegin-target"][hx-swap="afterbegin"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after click, a digit will be inserted before the first child of the target element
        const content = await page.locator('css=p#afterbegin-target').innerText()
        expect(content).toMatch(/[0-9]+\s+hoge/)
    })

    test("click button with hx-swap=beforebegin", async () => {
        const button = page.locator('css=button[hx-target="#beforebegin-target"][hx-swap="beforebegin"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after click, a digit will be inserted before the target element
        const p = page.locator('xpath=//p[@id="beforebegin-target"]/preceding-sibling::p[1]')
        expect(await p.innerText()).toMatch(/[0-9]+/)
    })

    test("click button with hx-swap=beforeend", async () => {
        const button = page.locator('css=button[hx-target="#beforeend-target"][hx-swap="beforeend"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after click, a digit will be inserted after the last child of the target element
        const p = page.locator('css=p#beforeend-target')
        await PW.expect(p).toContainText(/hoge\s*[0-9]+/)
    })

    test("click button with hx-swap=afterend", async () => {
        const button = page.locator('css=button[hx-target="#afterend-target"][hx-swap="afterend"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // after click, a digit will be inserted after the target element
        const parentDiv = page.locator('xpath=//p[@id="afterend-target"]//parent::div')
        const content = await parentDiv.innerText()
        expect(content).toMatch(/foo\s+hoge\s+[0-9]+/)
    })

    test("click button with hx-swap=delete", async () => {
        const button = page.locator('css=button[hx-swap="delete"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // click the button, then the target p will be deleted
        const parentDiv = button.locator('xpath=/preceding-sibling::div[1]')
        const content = await parentDiv.innerText()
        expect(content).not.toMatch(/hoge/)
    })

    test("click button with hx-swap=none", async () => {
        const button = page.locator('css=button[hx-swap="none"]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const div = page.locator('xpath=//p[@id="none-target"]/parent::div')
        const content1 = await div.innerText()
        await PW.expect(button).toBeVisible()
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        const content2 = await div.innerText()
        expect(content2).toEqual(content1)
    })

    test("transition:true", async () => {
        const button = page.locator('xpath=//h2[contains(.,"transition:true")][not(contains(.,"settle"))]/following-sibling::div[1]/button[contains(@hx-swap,"transition:true")]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const p = button.locator('xpath=./parent::div/child::p')
        await PW.expect(p).toContainText(/Embrace challenges/)
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/ja-saying/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        //
        const p2 = button.locator('xpath=./parent::div/child::p')
        await PW.expect(p2).toContainText(/挑戦を受け入れよう/)
    })

    test("swap:3s", async () => {
        const content = await page.locator('p#swap-target').innerText()
        expect(content).toMatch(/foo/)
        const button = page.locator('p#swap-target').locator('xpath=following-sibling::button[1]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        //
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/random/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // swap:3s means that the content will be swapped after 3 seconds, so we need to wait for 3 seconds before checking the content
        await page.waitForTimeout(3000)
        const content2 = await page.locator('p#swap-target').innerText()
        expect(content2).toMatch(/[0-9]+/)
        expect(content2).not.toEqual(content)
    })

    test("transition:true settle:3s", async () => {
        const div = page.locator('xpath=//h2[contains(.,"settle")]/following-sibling::div[1]')
        const content = await div.locator('css=p').innerText()
        expect(content).toMatch(/Embrace challenges/)
        const button = div.locator('css=button')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/ja-saying/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        // settle:3s means that the content will change settled after 3 seconds, so we need to wait for 3 seconds before checking the content
        await page.waitForTimeout(3000);
        const content2 = await div.locator('css=p').innerText()
        expect(content2).toMatch(/挑戦を受け入れよう/)
    })

    test("ignoreTitle:false", async () => {
        const button = page.locator('xpath=//h3[contains(.,"ignoreTitleがfalseの時")]/following-sibling::button[1]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/update-title/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200);
        //expect(await page.title()).toMatch(/New Title/)
        await PW.expect(page).toHaveTitle(/New Title/)
    })

    test("ignoreTitle:true", async () => {
        const button = page.locator('xpath=//h3[contains(.,"ignoreTitleがtrueの時")]/following-sibling::button[1]')
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/update-title/);
        await button.click()
        const response = await responsePromise;
        expect(response.status()).toBe(200)
        await PW.expect(page).not.toHaveTitle(/New Title/)
    })

    test("scroll", async () => {
        // what use? I don't see
    })

    test("show", async () => {
        // difficult to test
    })

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        driver.close();
    })
});
