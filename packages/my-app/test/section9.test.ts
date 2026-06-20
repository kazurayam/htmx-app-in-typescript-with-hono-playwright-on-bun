// e2e/section9.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import * as PW from '@playwright/test';
import { BrowserDriverChromium } from './BrowserDriverChromium';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(["my-app", "section9.test"]);
const url = 'http://localhost:3001/section9';

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

    test("スピナー", async () => {
        //click the button, a spinner appears and moves for 5seconds until the response is received, then the label changes from クリック to ロード完了
        const button = page.locator('css=button[hx-indicator="#spinner"]');
        await button.waitFor({ state: 'visible', timeout: 10000 });
        await PW.expect(button).toBeEnabled();

        // I could not specify the timeout for waitForResponse() to be longer than 5 seconds, so I will wait for the response after clicking the button without specifying the timeout
        // see https://github.com/kazurayam/htmx-app-in-typescript-with-hono-playwright-on-bun/issues/17
        const responsePromise: Promise<PW.Response> =
            page.waitForResponse(/\/heavy/, { timeout: 20_000 });
        await button.click()
        const img: PW.Locator = page.locator('css=img#spinner')
        expect(await toHaveClasses(img, 'htmx-indicator htmx-request')).toBeTruthy()
        const response = await responsePromise;
        expect(response.status()).toBe(200);

        // then the label changes from クリック to ロード完了 after 5 seconds when the response is received
        const label = page.locator('css=button[hx-indicator="#spinner"]');
        await PW.expect(label).toHaveText("ロード完了!", { timeout: 10_000 });
    }, 20_000);
    // ^^^^^^ I set the timeout for this test to 10 seconds because the URL '/heavy' takes 5 seconds + alpha,
    // which is the default timeout of the 'it' of 'bun:test'. I want to give it some extra time

    afterEach(async () => {
        await page.close();
    });
    afterAll(async () => {
        driver.close();
    })
});

// A helper function that verifies the class attribute of an element to which the locator points
// original: https://stackoverflow.com/questions/66241109/check-if-element-class-contains-string-using-playwright
async function toHaveClasses(locator: PW.Locator, classNames: string): Promise<Boolean> {
    // get current classes of element
    const attrClass = await locator.getAttribute('class')  // may be null
    const elementClasses: string[] = attrClass ? attrClass.split(' ') : []
    const targetClasses: string[] = classNames.split(' ')
    // Every class should be present in the current class list
    const isValid = targetClasses.every(classItem => elementClasses.includes(classItem))
    return Promise.resolve(isValid)
}
