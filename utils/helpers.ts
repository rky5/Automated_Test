import { Page } from '@playwright/test';

export async function waitForElement(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
}

export async function takeScreenshot(page: Page, name: string) {
    await page.screenshot({ path: `screenshots/${name}.png` });
}

export async function addPrice(priceList: string[]): Promise<string> {
    let totalPrice: number = 0;
    let tax: number = 0;
    for (const price of priceList) {
        totalPrice = totalPrice + parseFloat(price.replaceAll('$', ""));
    }
    tax = (8 / 100) * totalPrice;
    return `$${parseFloat(totalPrice.toFixed(2)) + parseFloat(tax.toFixed(2))}`;
}

export function getRandomNumber(max: number, usedNumbers: Set<number>): number {
    let randomNumber: number;
    do {
        randomNumber = Math.floor(Math.random() * max) + 1;
    } while (usedNumbers.has(randomNumber));

    return randomNumber;
}