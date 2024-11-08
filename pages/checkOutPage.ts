import { Page, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import { addPrice } from '../utils/helpers';

export class CheckOutPage {
    private page: Page;
    private _itemName: string;


    constructor(page: Page) {
        this.page = page;
    }

    // Element Identifiers
    private get checkOut() { return this.page.locator('#checkout'); }
    private get itemSelected() { return this.page.locator(`//div[normalize-space(text())="${this._itemName}"]/ancestor::div[@class="cart_item_label"]/div[@class="item_pricebar"]/button[text()="Remove"]`); }
    private get fName() { return this.page.locator('#first-name'); }
    private get lName() { return this.page.locator('#last-name'); }
    private get zip() { return this.page.locator('#postal-code'); }
    private get continue() { return this.page.locator('#continue'); }
    private get inventoryItemName() { return this.page.locator(`//div[@class="inventory_item_name"][text()="${this._itemName}"]`); }
    private get finishButton() { return this.page.locator('#finish'); }

    async validateCartItem(cartItemList: Map<string, cartItem>) {
        for (const [items, cartItem] of cartItemList) {
            this._itemName = cartItem.name;
            await this.itemSelected.isVisible();
        }
    }

    async proceedCheckout() {
        await this.checkOut.click();
        logger.debug('"Checkout" button is clicked');
    }

    async inputDetailsAndConti(fName: string, lName: string, zip: string) {
        await this.fName.fill(fName);
        logger.debug(`"First Name" is filled with ${fName}`);
        await this.lName.fill(lName);
        logger.debug(`"Last Name" is filled with value: ${lName}`);
        await this.zip.fill(zip);
        logger.debug(`"Zip" is filled with value: ${zip}`);
        await this.continue.click();
        logger.debug('"Continue" button is clicked');
    }

    async validateOverview(cartItemList: Map<string, cartItem>) {
        let priceList: string[] = [];

        for (const [items, cartItem] of cartItemList) {
            this._itemName = cartItem.name;
            priceList.push(cartItem.price);
            expect(this.inventoryItemName.isVisible()).toBeTruthy();
            logger.info(`Item "${this._itemName}" is on checkout page.`);
        }

        expect(await this.page.locator('//div[@class="summary_total_label"]').textContent()).toEqual(`Total: ${await addPrice(priceList, "$29.99")}`);
    }

    async finishAndValidate() {
        await this.finishButton.click();
        expect(this.page.locator('text="Thank you for your order!"')).toBeTruthy();
        logger.info('User succesfully checkout the products.!!');
    }
}
