import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';
import { InventoryPage } from '../pages/InventoryPage';
import { CheckOutPage } from '../pages/checkOutPage';
dotenv.config();

test.describe('Customer Flow', () => {
    test('Customer flow of selecting 3 random items and completing the checkout flow.', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const invetoryPage = new InventoryPage(page);
        const checkOutPage = new CheckOutPage(page);

        await loginPage.navigateTo();
        await loginPage.login(process.env.S_USER_NAME, process.env.PASSWORD);
        await expect(page).toHaveURL('/inventory.html');

        let cartItems: Map<string, cartItem> = await invetoryPage.addToCart(3);
        await invetoryPage.goToCart();
        await checkOutPage.validateCartItem(cartItems);
        await checkOutPage.proceedCheckout();
        await checkOutPage.inputDetailsAndConti("Ranjit", "Yadav", "900109");
        await checkOutPage.validateOverview(cartItems);
        await checkOutPage.finishAndValidate();
    });
});
