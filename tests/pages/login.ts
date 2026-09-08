import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginCredentials: Locator;
    readonly loginPassword: Locator;
    readonly error: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.loginCredentials = page.locator('[data-test="login-credentials"]');
        this.loginPassword = page.locator('[data-test="login-password"]');
        this.error = page.locator('[data-test="error"]');
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
