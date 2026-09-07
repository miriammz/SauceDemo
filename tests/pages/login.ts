import { expect, type Locator, type Page } from '@playwright/test';

export class LoginAndMenuPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginCredentials: Locator;
    readonly loginPassword: Locator;
    readonly menu: Locator;
    readonly inventory: Locator;
    readonly about: Locator;
    readonly logout: Locator;
    readonly reset: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.loginCredentials = page.locator('[data-test="login-credentials"]');
        this.loginPassword = page.locator('[data-test="login-password"]');
        this.menu = page.getByRole('button', { name: 'Open Menu' });
        this.inventory = page.locator('[data-test="inventory-sidebar-link"]');
        this.about = page.locator('[data-test="about-sidebar-link"]');
        this.logout = page.locator('[data-test="logout-sidebar-link"]');
        this.reset = page.locator('[data-test="reset-sidebar-link"]');
    }

    async load() {
        await this.page.goto('https://saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}
