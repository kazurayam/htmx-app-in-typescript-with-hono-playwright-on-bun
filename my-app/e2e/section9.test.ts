// e2e/section9.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Browser, Page, Locator, chromium } from 'playwright-chromium';


// A helper function that verifies the class attribute of an element to which the locator points
// original: https://stackoverflow.com/questions/66241109/check-if-element-class-contains-string-using-playwright
async function toHaveClasses(locator: Locator, classNames: string): Promise<Boolean> {
    // get current classes of element
    const attrClass = await locator.getAttribute('class')  // may be null
    const elementClasses: string[] = attrClass ? attrClass.split(' ') : []
    const targetClasses: string[] = classNames.split(' ')
    // Every class should be present in the current class list
    const isValid = targetClasses.every(classItem => elementClasses.includes(classItem))
    console.log("isValid: " + isValid)
    return Promise.resolve(isValid)
}

describe('test http://localhost:3001/section9', async () => {
    let browser: Browser;
    let page: Page;
    beforeAll(async () => {
        browser = await chromium.launch({ timeout: 10000 });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/section9', { timeout: 10000 })
    });

    it("click the button, a spinner appears for 5s, then the label changes from クリック to ロード完了", async () => {
        const button = page.locator('css=button[hx-indicator="#spinner"]');
        expect(await button.isVisible())
        await button.click()
        const img: Locator = page.locator('css=img#spinner')
        // https://jestjs.io/docs/expect
        expect(await toHaveClasses(img, 'htmx-indicator htmx-request')).toBeTruthy()
    });

    afterAll(async () => {
        await browser.close();
    });
});
