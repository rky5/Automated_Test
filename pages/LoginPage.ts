import { Page, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private get usernameInput() { return this.page.locator('#user-name'); }
    private get passwordInput() { return this.page.locator('#password'); }
    private get loginButton() { return this.page.locator('#login-button'); }

    async navigateTo() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        logger.debug(`"User Name" is filled with ${username}`);
        await this.passwordInput.fill(password);
        logger.debug(`"Password" is filled with ${password}`);
        await this.loginButton.click();
        logger.debug('"Login" button is clicked');
    }
}
