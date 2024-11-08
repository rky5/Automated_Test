import { Page, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import { getRandomNumber } from '../utils/helpers';

export class InventoryPage {
    private page: Page;
    private _itemName: string;


    constructor(page: Page) {
        this.page = page;
    }

    private get item() { return this.page.locator(`//div[normalize-space(text())="${this._itemName}"]/ancestor::div[@class="inventory_item_description"]/div[@class="pricebar"]/button[text()="Add to cart"]`); }
    private get itemSelected() { return this.page.locator(`//div[normalize-space(text())="${this._itemName}"]/ancestor::div[@class="inventory_item_description"]/div[@class="pricebar"]/button[text()="Remove"]`); }
    private get checkOutIcon() { return this.page.locator('.shopping_cart_link'); }
    private get inventoryList() { return this.page.locator('.inventory_item'); }

    async addToCart(randomCounut: number): Promise<Map<string, cartItem>> {
        const cartItemList = new Map<string, cartItem>();
        const usedRandom = new Set<number>();

        for (let i = 0; i < randomCounut; i++) {
            let randomItem = getRandomNumber(await this.inventoryList.count(), usedRandom);
            usedRandom.add(randomItem);

            let itemName = this.page.locator(`//div[normalize-space(@class)="inventory_item"][${randomItem}]//div[normalize-space(@class)="inventory_item_label"]//div[normalize-space(@class)="inventory_item_name"]`);
            let itemPrice = this.page.locator(`//div[normalize-space(@class)="inventory_item"][${randomItem}]//div[normalize-space(@class)="inventory_item_price"]`);
            
            cartItemList.set(`Item_${i + 1}`, { name: await itemName.textContent(), price: await itemPrice.textContent() });

            this._itemName = cartItemList.get(`Item_${i + 1}`)?.name;
            
            await this.page.locator(`//div[@class="inventory_item"][${randomItem}]//div[@class="pricebar"]/button`).click();
            logger.debug(`Add To Cart button for Item "${this._itemName}" is successfully clicked.`);
            expect(await this.itemSelected.isVisible()).toBeTruthy();
            logger.info(`Item "${this._itemName}" is successfully selected.`);
        }
        return cartItemList;
    }

    async goToCart() {
        await this.checkOutIcon.click();
        logger.debug('"Checkout" Icon is clicked');
    }
}
